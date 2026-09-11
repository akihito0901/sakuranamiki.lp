/*
 * 配信用のディレクトリ dist/ を作る。
 *
 *   node tools/prerender.js && node tools/build.js
 *   npx wrangler pages deploy dist --project-name=sakuranamiki-lp --branch=main --commit-dirty=true
 *
 * リポジトリ直下をそのまま上げてはいけない理由:
 *   ・images/ が80MB以上あり、実際に使っているのは15ファイル・約2MBだけ
 *   ・.git、app.js（ビルド用ソース）、vendor/（プリレンダ用のReact）が混ざる
 * そのため index.html / lp.js / styles.css から参照されている画像だけを集める。
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

// ブラウザへ配信するファイル
const FILES = ['index.html', 'lp.js', 'styles.css', '_headers', 'robots.txt', 'sitemap.xml'];

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(DIST, 'images'), { recursive: true });

for (const f of FILES) {
  const src = path.join(ROOT, f);
  if (!fs.existsSync(src)) throw new Error('見つからない: ' + f);
  fs.copyFileSync(src, path.join(DIST, f));
}

// 参照されている画像だけを拾う
const refs = new Set();
for (const f of ['index.html', 'lp.js', 'styles.css']) {
  const s = fs.readFileSync(path.join(ROOT, f), 'utf8');
  for (const m of s.matchAll(/\.\/images\/[A-Za-z0-9._-]+/g)) refs.add(m[0].slice(2));
}

let bytes = 0;
for (const r of [...refs].sort()) {
  const src = path.join(ROOT, r);
  if (!fs.existsSync(src)) throw new Error('参照先の画像が無い: ' + r);
  fs.copyFileSync(src, path.join(DIST, 'images', path.basename(r)));
  bytes += fs.statSync(src).size;
}

const total = FILES.reduce((n, f) => n + fs.statSync(path.join(DIST, f)).size, 0) + bytes;
console.log('配信ファイル: %d 個', FILES.length);
console.log('参照画像: %d 個 / %s MB', refs.size, (bytes / 1048576).toFixed(2));
console.log('dist 合計: %s MB', (total / 1048576).toFixed(2));
