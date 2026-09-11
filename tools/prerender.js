/*
 * app.js（Reactコンポーネント定義）を一度だけレンダリングして、
 * その結果を index.html の <div id="root"> に埋め込む。
 *
 * ブラウザにはReactを送らない。配信されるのは
 *   index.html（本文が焼き込み済み） + lp.js（動きだけ） + styles.css
 * の3つで、Reactはこのビルド時にしか使わない。
 *
 * 使い方:  node tools/prerender.js
 *
 * app.js を編集したら必ずこれを実行して index.html を作り直すこと。
 * 実行しないと画面に反映されない。
 */
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

const reactSrc = read('vendor/react.production.min.js');
const rdsSrc = read('tools/react-dom-server-legacy.browser.production.min.js');
const appSrc = read('app.js');

// app.js が参照する最低限のDOMだけ用意する。描画には使われない。
const noop = () => {};
const fakeEl = {
  setAttribute: noop,
  appendChild: noop,
  style: {},
  classList: { add: noop, remove: noop },
};

const sandbox = {
  console, setTimeout, clearTimeout, setInterval, clearInterval,
  queueMicrotask, Promise, Math, Date, JSON,
  parseInt, parseFloat, String, Number, Object, Array, Error,
  TextEncoder, TextDecoder, Uint8Array, ArrayBuffer, AbortController,
};
sandbox.window = sandbox;
sandbox.self = sandbox;
sandbox.globalThis = sandbox;
sandbox.navigator = { userAgent: 'node' };
sandbox.document = {
  getElementById: () => fakeEl,
  createElement: () => fakeEl,
  getElementsByTagName: () => [fakeEl],
  addEventListener: noop,
  head: fakeEl,
  body: fakeEl,
  documentElement: fakeEl,
};
sandbox.IntersectionObserver = function () {
  return { observe: noop, disconnect: noop, unobserve: noop };
};

vm.createContext(sandbox);
vm.runInContext(reactSrc, sandbox, { filename: 'react.js' });
vm.runInContext(rdsSrc, sandbox, { filename: 'react-dom-server.js' });

if (!sandbox.React) throw new Error('React グローバルが設定されていない');
if (!sandbox.ReactDOMServer) throw new Error('ReactDOMServer グローバルが設定されていない');

// ヒーローA/BはHTMLにAを焼き、B判定のときだけ lp.js が差し替える
sandbox.AB_VARIANT = 'a';

// app.js 末尾の createRoot().render() を横取りして要素を取り出す
let captured = null;
sandbox.ReactDOM = {
  createRoot: () => ({ render: (el) => { captured = el; } }),
};

vm.runInContext(appSrc, sandbox, { filename: 'app.js' });
if (!captured) throw new Error('render() が呼ばれなかった');

const markup = sandbox.ReactDOMServer.renderToStaticMarkup(captured);

// index.html の #root の中身を差し替える
const indexPath = path.join(ROOT, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// BEGIN/END のコメントで囲まれた範囲だけを差し替える。
// 目印は body 内にしか現れない文字列にしてある（以前 id="root" で探していたら
// head のコメント内の同じ文字列にマッチして、head の後半を丸ごと消してしまった）。
const BEGIN = '<!-- BEGIN prerendered';
const END = '<!-- END prerendered -->';
const bi = html.indexOf(BEGIN);
const ei = html.indexOf(END);
if (bi === -1 || ei === -1 || ei < bi) {
  throw new Error('index.html に BEGIN/END prerendered の目印が見つからない');
}
if (html.indexOf(BEGIN, bi + 1) !== -1) {
  throw new Error('BEGIN prerendered の目印が複数ある');
}
const beginEnd = html.indexOf('-->', bi) + 3;
html = html.slice(0, beginEnd)
  + '\n    <div id="root">\n' + markup + '\n</div>\n    '
  + html.slice(ei);

fs.writeFileSync(indexPath, html, 'utf8');

console.log('埋め込んだHTML: %d bytes', Buffer.byteLength(markup, 'utf8'));
console.log('index.html: %d bytes', Buffer.byteLength(html, 'utf8'));
console.log('img=%d  h2=%d  svg=%d',
  (markup.match(/<img/g) || []).length,
  (markup.match(/<h2/g) || []).length,
  (markup.match(/<svg/g) || []).length);
