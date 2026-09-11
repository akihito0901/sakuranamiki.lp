# 桜並木駅前の整骨院 LP

福岡市博多区の整骨院のランディングページ。Meta広告の出稿先。

---

## ★作業を始める前に必ずやること

**下の「未完了タスク」を依頼者に提示して、着手するか確認する。**
依頼された作業だけ黙って進めない。「これが残っていますが、ついでにやりますか？」と毎回聞く。
依頼者本人からの指示です。

### 未完了タスク（2026-09-13時点）

- [ ] **Xserverへのアップロード（最優先・準備完了）**
  - 設置先: `https://sakuranamiki1.com/shinsokin/`
  - ZIP: `C:\Users\sanji\Downloads\shinsokin_アップロード用.zip`
  - 再生成する場合: `node tools/prerender.js && node tools/build.js xserver`
  - 本サイトは Xserver 上の WordPress。`public_html/sakuranamiki1.com/shinsokin/` に
    ZIPの**中身**を展開する。`.htaccess` は隠しファイルなのでアップロード漏れに注意
  - 現状LPは Vercel と pages.dev にあり、どちらも本サイトとは別ドメイン。
    本サイトのSEO評価が一切流れてこない状態

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

## 広告のリンク先とヒーローの状況（2026-09-13時点）

**広告のリンク先は Vercel の `https://sakuranamiki-lp.vercel.app/`。**
GitHubに push すると Vercel も Cloudflare も自動で更新される。

| | URL | ヒーロー |
|---|---|---|
| 本番（広告） | <https://sakuranamiki-lp.vercel.app/> | `hero-shinsokin.webp`（深層筋・Google口コミ5.0入り） |
| 控え | <https://sakuranamiki-lp.vercel.app/c.html> | `hero-empathy.webp`（共感訴求） |
| 確認用 | <https://sakuranamiki-lp.pages.dev/> ／ `/c` | 同上 |

- **A/Cテストは見送り中。** 予算が月5万円・週50リード規模で、折半すると
  どちらのパターンも決着がつかないため。全員が本番（深層筋）を見ている。
- **URLを変えずにページの中身を変える分には学習はリセットされない。**
  Metaが見ているのは広告の設定だけで、リンク先の中身は検知しない。
  ヒーロー差し替えもこの方法で行った（学習の損失ゼロ）。
- 逆に**リンク先URLを変えると学習はリセットされる**（クリエイティブ変更扱い）。
  A/Cテストを始めるならそのコストが必ず発生する。
- ファイル名は中身を表す（`hero-shinsokin` / `hero-empathy`）。
  `a` / `c` はURLのスロットを指すだけで、中身とは対応していない。
- **Cloudflareは `/c`、Vercelは `/c.html`。** Vercelは `.html` を省略できない。
- 計測: `LPView` の `variant` に `a` / `c`、Leadの `content_name` は `line_a` など。

**※ Vercelは今も生きていて広告の配信先になっている。**
クライアント案件をVercel無料枠で配信するのは規約上の懸念があり、
本来はCloudflareへ寄せる方針。ただしURL変更＝学習リセットになるため、
9/19-20の山を越えるまでは据え置きの判断。

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
| `lp.js` | fade-up / Q&A開閉 / CTAアニメ / タップ計測 | される |
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
