# 桜並木駅前の整骨院 LP

福岡市博多区の整骨院のランディングページ。Meta広告の出稿先。

---

## ★作業を始める前に必ずやること

**下の「未完了タスク」を依頼者に提示して、着手するか確認する。**
依頼された作業だけ黙って進めない。「これが残っていますが、ついでにやりますか？」と毎回聞く。
依頼者本人からの指示です。

### 未完了タスク（2026-09-11時点）

- [ ] **Xserverへのアップロード（最優先・準備完了）**
  - 設置先: `https://sakuranamiki1.com/shinsokin/`
  - ZIP: `C:\Users\sanji\Downloads\shinsokin_アップロード用.zip`
  - 再生成する場合: `node tools/prerender.js && node tools/build.js xserver`
  - 本サイトは Xserver 上の WordPress。`public_html/sakuranamiki1.com/shinsokin/` に
    ZIPの**中身**を展開する。`.htaccess` は隠しファイルなのでアップロード漏れに注意
  - 現状LPは `pages.dev` にあり、本サイトのSEO評価が一切流れてこない状態

- [ ] **本サイトに「深層筋集中整体とは」の記事を作り、LPへ内部リンクを張る**
  - **SEOの本体はこれ。** サブディレクトリに置くのは前提条件にすぎず、
    実際に評価を渡すのは本サイトからの内部リンク。設置しただけでは効果が出ない
  - 依頼者の想定文面:
    「総来院1,000名突破、Google口コミ評価星5。30代〜50代の女性に人気の
    深層筋集中整体はなぜ人気なのか？ぜひこちらの詳細ページからご確認ください」

- [ ] **アップロード後: pages.dev 側を noindex にする**（同一内容の重複を避ける）
- [ ] **アップロード後: 広告のリンク先を `/shinsokin/` に変更**
- [ ] **アップロード後: Search Console でインデックス登録を申請**

- [ ] CTA変更後の数字を追う
  - 2026-09-11にCTAを「確認」訴求から「予約」訴求へ全面変更した
  - **友だち追加数とCPAは悪化する見込み。それは想定どおり**
  - 見るべきは予約数、または 予約数 ÷ 友だち追加数
  - CV数だけ見て「改悪した」と判断しないよう注意喚起すること

- [ ] Q&AのFAQ構造化データ（未実装）
- [ ] 画像で伝えている内容を読めるテキストにも起こす（alt文では補済み）

---

## ヒーローのA/Cテスト（2026-09-11〜 実施中）

ページ本体は完全に同一で、**違うのはヒーロー画像1枚だけ**。

| | URL（Cloudflare Pages） | ヒーロー |
|---|---|---|
| A | <https://sakuranamiki-lp.pages.dev/> | `hero-ab-a-empathy.webp`（共感訴求） |
| C | <https://sakuranamiki-lp.pages.dev/c> | `hero-ab-c-shinsokin.webp`（深層筋集中整体） |

- **MetaのA/Bテスト機能で広告ごとにリンク先URLを分ける方式。**
  以前はJSが50/50に振り分けていたが廃止した（同じ人が両方見る重複が起きるため）。
- `tools/prerender.js` が `index.html`（A）と `c.html`（C）の2枚を生成する。
  それぞれに正しい画像が焼き込まれているので、JSでの差し替えは無い。
- `c.html` は `noindex`、canonical は `/` を指す（中身がほぼ同じなので重複回避）。
- **Cloudflare Pages は `/c.html` を `/c` へ308リダイレクトする。**
  広告のリンク先には余計な転送を避けるため `/c` を使うこと。
  Xserverに移設した場合はリダイレクトされないので `/shinsokin/c.html` になる。
- 計測: `LPView` イベントの `variant` に `a` / `c` が入る。
  Leadイベントの `content_name` も `line_a` / `tel_c` のように末尾に付く。
- A対Bは改修前のLPで実施してAが勝った。**その後ページを大きく変えているので、
  今回のA対Cは仕切り直しの新しいテスト。**

## ★編集したら prerender が必要

**`app.js` はブラウザに配信されない。編集しただけでは画面に反映されない。**

```bash
node tools/prerender.js   # app.js の内容を index.html に焼き込む（必須）
node tools/build.js       # dist/ を作る（Cloudflare Pages 確認用）
npx wrangler pages deploy dist --project-name=sakuranamiki-lp --branch=main --commit-dirty=true
```

本番（Xserver）用は `node tools/build.js xserver` → `dist-xserver/`。
canonical・OGP・構造化データ・sitemap の絶対URL8箇所を自動で書き換え、`.htaccess` を生成する。

### ファイルの役割

| ファイル | 役割 | 配信 |
|---|---|---|
| `app.js` | **本文・文言の編集はここ** | されない |
| `index.html` | `app.js` から自動生成される完成品 | される |
| `lp.js` | fade-up / Q&A開閉 / CTAアニメ / ヒーローA/B / タップ計測 | される |
| `styles.css` | Tailwindのビルド済み出力 | される |
| `tools/prerender.js` | `app.js` → `index.html` | されない |
| `tools/build.js` | 配信用ディレクトリ生成 | されない |
| `vendor/` | プリレンダ時のReact | されない |

---

## ★触るときの注意

- **`styles.css` は再ビルドできない**（node_modules も package.json も無い）。
  新しいクラス名を書いてもCSSが存在せず効かない。**編集は既存クラスの範囲で行う。**
- **`index.html` の `<!-- BEGIN prerendered -->` 〜 `<!-- END prerendered -->` は自動生成。**
  直接編集しない。またこの目印と紛らわしい文字列をコメント等に書かない
  （過去に `id="root"` で探してheadのコメントに誤マッチし、`styles.css` の
  読み込みごと消す事故を起こしている）。
- **リポジトリ直下をそのままデプロイしない。** `images/` が80MB以上あり、
  実際に使うのは15ファイル・約2MBだけ。`.git` や `app.js` も混ざる。必ず `tools/build.js` を通す。
- **画像は `_headers` / `.htaccess` で1日キャッシュ。** ファイル名を変えずに差し替える運用なので
  長期キャッシュにしていない。差し替え後、既訪問端末には最大1日古い画像が出る。
  確認はシークレットウィンドウで。
- **Cloudflare Pages のプロジェクト名は `sakuranamiki-lp` 固定。**
  別名でデプロイすると新しいURLが生えてクライアントに渡したリンクが死ぬ。
- wrangler 4.131以降は `wrangler pages` をWorkersに委譲して失敗する。
  プロジェクト新規作成時のみ `--force`、作成後は付けない。
- **構造化データに星評価（aggregateRating）を入れない。**
  自社サイトに自社の評価を書くのはGoogleのガイドライン違反で、
  構造化データ全体が無視されるおそれがある。星はGoogleビジネスプロフィール側で出す。

---

## 公開先・関連

- 確認用: <https://sakuranamiki-lp.pages.dev>（Cloudflare Pages / `sakuranamiki-lp`）
- 本番予定: <https://sakuranamiki1.com/shinsokin/>（Xserver / WordPress配下）
- 本サイト: <https://sakuranamiki1.com/>
- GitHub: <https://github.com/akihito0901/sakuranamiki.lp>
- 作業ログ: Obsidian `📔ジャーナル/2026/2026-09-11_桜並木LP_構成変更と高速化.md`
- LINE: <https://lin.ee/uqCRkRL> ／ 電話: 070-5530-6656
