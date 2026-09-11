/*
 * 配信用のディレクトリを作る。出力先は2種類。
 *
 *   node tools/build.js            → dist/        Cloudflare Pages 用（確認用）
 *   node tools/build.js xserver    → dist-xserver/ 本番用（sakuranamiki1.com/shinsokin/）
 *
 * デプロイ:
 *   Cloudflare … npx wrangler pages deploy dist --project-name=sakuranamiki-lp --branch=main --commit-dirty=true
 *   Xserver    … dist-xserver/ の中身を public_html/shinsokin/ へアップロード
 *
 * リポジトリ直下をそのまま上げてはいけない理由:
 *   ・images/ が80MB以上あり、実際に使っているのは15ファイル・約2MBだけ
 *   ・.git、app.js（ビルド用ソース）、vendor/（プリレンダ用のReact）が混ざる
 * そのため index.html / lp.js / styles.css から参照されている画像だけを集める。
 *
 * ページ内のパスは ./images/ のような相対指定なので、どの階層に置いても動く。
 * 書き換えが要るのは canonical や OGP などの絶対URLだけ。
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// ソース側に書いてあるURL。これを出力先に応じて置換する。
const SRC_BASE = 'https://sakuranamiki-lp.pages.dev';

const target = process.argv[2] === 'xserver' ? 'xserver' : 'pages';
const CONF = {
  pages: {
    dir: 'dist',
    base: SRC_BASE,
    // Cloudflare Pages 専用のキャッシュ設定ファイル
    extra: ['_headers', 'robots.txt', 'sitemap.xml'],
  },
  xserver: {
    dir: 'dist-xserver',
    base: 'https://sakuranamiki1.com/shinsokin',
    // robots.txt はドメイン直下にしか効かないのでサブディレクトリには置かない。
    // キャッシュ設定は _headers ではなく .htaccess を使う。
    extra: ['sitemap.xml'],
  },
}[target];

const DIST = path.join(ROOT, CONF.dir);
const BASE_FILES = ['index.html', 'lp.js', 'styles.css'];

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(DIST, 'images'), { recursive: true });

// URLを書き換えながらコピーするテキストファイル
const rewritable = new Set(['index.html', 'robots.txt', 'sitemap.xml']);
let rewrites = 0;

for (const f of [...BASE_FILES, ...CONF.extra]) {
  const src = path.join(ROOT, f);
  if (!fs.existsSync(src)) throw new Error('見つからない: ' + f);
  if (rewritable.has(f) && CONF.base !== SRC_BASE) {
    let s = fs.readFileSync(src, 'utf8');
    const n = s.split(SRC_BASE).length - 1;
    s = s.split(SRC_BASE).join(CONF.base);
    rewrites += n;
    fs.writeFileSync(path.join(DIST, f), s, 'utf8');
  } else {
    fs.copyFileSync(src, path.join(DIST, f));
  }
}

// Xserver 用は .htaccess を置く
if (target === 'xserver') {
  fs.writeFileSync(path.join(DIST, '.htaccess'), [
    '# このディレクトリは静的ファイルだけ。WordPressの書き換えを持ち込まない。',
    'RewriteEngine Off',
    'DirectoryIndex index.html',
    '',
    '# キャッシュ設定（Cloudflareの _headers に相当）。',
    '# 画像はファイル名を変えずに差し替える運用なので長期キャッシュにしない。',
    '<IfModule mod_headers.c>',
    '  <FilesMatch "\\.(webp|mp4|png|jpg|jpeg)$">',
    '    Header set Cache-Control "public, max-age=86400, stale-while-revalidate=604800"',
    '  </FilesMatch>',
    '  # HTML/JS/CSS は毎回確認させる。差し替えが即反映されるように。',
    '  <FilesMatch "\\.(html|js|css)$">',
    '    Header set Cache-Control "public, max-age=0, must-revalidate"',
    '  </FilesMatch>',
    '</IfModule>',
    '',
  ].join('\n'), 'utf8');
}

// 参照されている画像だけを拾う
const refs = new Set();
for (const f of BASE_FILES) {
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

const files = fs.readdirSync(DIST).filter((f) => f !== 'images');
const total = files.reduce((n, f) => n + fs.statSync(path.join(DIST, f)).size, 0) + bytes;

console.log('出力先   : %s/', CONF.dir);
console.log('ベースURL: %s', CONF.base);
if (rewrites) console.log('URL書換  : %d 箇所', rewrites);
console.log('ファイル : %s', files.join(', '));
console.log('画像     : %d 個 / %s MB', refs.size, (bytes / 1048576).toFixed(2));
console.log('合計     : %s MB', (total / 1048576).toFixed(2));
