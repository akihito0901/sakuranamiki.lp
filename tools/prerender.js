/*
 * app.js（Reactコンポーネント定義）をレンダリングして、その結果を
 * HTMLに焼き込む。ヒーローのA/Cテスト用に2ページ出力する。
 *
 *   index.html … ヒーローA（共感訴求）
 *   c.html     … ヒーローC（深層筋集中整体）
 *
 * どちらも同じ階層に置くので ./images/ などの相対パスはそのまま使える。
 * MetaのA/Bテストで広告ごとにリンク先URLを分けて戦わせる想定。
 * ページごとに正しい画像を焼き込むので、以前のようにJSで差し替える必要がなく、
 * C側の人がA画像まで読み込んでしまう無駄も無い。
 *
 * ブラウザにReactは送らない。配信されるのは
 *   index.html / c.html + lp.js + styles.css の3種類だけ。
 *
 * 使い方:  node tools/prerender.js
 *
 * app.js または index.html を編集したら必ずこれを実行すること。
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

/* app.js を1回レンダリングして、出来上がったHTML文字列を返す。
   variant ごとにまっさらな環境を作り直す（状態を持ち越さないため）。 */
function render(variant) {
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

  // app.js の Headline がこれを見てヒーローを決める
  sandbox.AB_VARIANT = variant;

  let captured = null;
  sandbox.ReactDOM = {
    createRoot: () => ({ render: (el) => { captured = el; } }),
  };
  vm.runInContext(appSrc, sandbox, { filename: 'app.js' });
  if (!captured) throw new Error('render() が呼ばれなかった');

  return sandbox.ReactDOMServer.renderToStaticMarkup(captured);
}

/* BEGIN/END のコメントで囲まれた範囲を差し替える。
   目印は body 内にしか現れない文字列にしてある（以前 id="root" で探していたら
   head のコメント内の同じ文字列にマッチして、head の後半を丸ごと消してしまった）。 */
function inject(html, markup) {
  const BEGIN = '<!-- BEGIN prerendered';
  const END = '<!-- END prerendered -->';
  const bi = html.indexOf(BEGIN);
  const ei = html.indexOf(END);
  if (bi === -1 || ei === -1 || ei < bi) {
    throw new Error('BEGIN/END prerendered の目印が見つからない');
  }
  if (html.indexOf(BEGIN, bi + 1) !== -1) {
    throw new Error('BEGIN prerendered の目印が複数ある');
  }
  const beginEnd = html.indexOf('-->', bi) + 3;
  return html.slice(0, beginEnd)
    + '\n    <div id="root">\n' + markup + '\n</div>\n    '
    + html.slice(ei);
}

// index.html を雛形として読む（前回の焼き込み結果は inject が差し替える）
const template = read('index.html');

const VARIANT_MARK = /var variant = '[a-z]'; \/\* PRERENDER:VARIANT \*\//;
if (!VARIANT_MARK.test(template)) {
  throw new Error("index.html に PRERENDER:VARIANT の目印が見つからない");
}

// ── A（index.html）──
let htmlA = inject(template, render('a'));
htmlA = htmlA.replace(VARIANT_MARK, "var variant = 'a'; /* PRERENDER:VARIANT */");
fs.writeFileSync(path.join(ROOT, 'index.html'), htmlA, 'utf8');

// ── C（c.html）──
let htmlC = inject(template, render('c'));
htmlC = htmlC.replace(VARIANT_MARK, "var variant = 'c'; /* PRERENDER:VARIANT */");
// 中身がAとほぼ同じなので検索結果には出さない。canonical は / を指したままにして、
// 評価がすべて本体のURLに集まるようにする。
htmlC = htmlC.replace(
  /<meta name="robots" content="[^"]*">/,
  '<meta name="robots" content="noindex, follow">'
);
if (!/noindex/.test(htmlC)) throw new Error('c.html に noindex を入れられなかった');
fs.writeFileSync(path.join(ROOT, 'c.html'), htmlC, 'utf8');

const kb = (s) => (Buffer.byteLength(s, 'utf8') / 1024).toFixed(1) + 'KB';
console.log('index.html (ヒーローA): %s', kb(htmlA));
console.log('c.html     (ヒーローC): %s  ※noindex', kb(htmlC));
for (const [name, h] of [['index.html', htmlA], ['c.html', htmlC]]) {
  // 実際に描画されるヒーロー（data-hero が付いた img）を確認用に出す
  const m = h.match(/<img src="\.\/images\/(hero-ab-[a-z-]+\.webp)"[^>]*data-hero/);
  console.log('  ' + name + ' のヒーロー: ' + (m ? m[1] : '不明'));
}
