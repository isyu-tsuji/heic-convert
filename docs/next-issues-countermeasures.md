# 次の課題と対策

作成日: 2026-05-18
参照: `ROADMAP.md`

## 前提

MVPはブラウザ完結のHEIC変換ツールとして動く状態になった。
次の段階では、単なる変換ツールではなく「HEIC問題の解決サイト」として公開に耐える状態へ寄せる。

## 課題1: ロードマップ参照の不整合

現状:

- `AGENTS.md` は `ROADMAP.md` を参照している。
- 元ファイルは `heic-flip-roadmap.md` として配置されていた。

対策:

- `heic-flip-roadmap.md` と同内容の `ROADMAP.md` をプロジェクトルートに作成する。
- 今後の戦略・ロードマップ参照は `ROADMAP.md` に統一する。

完了条件:

- `ROADMAP.md` が存在する。
- `AGENTS.md` の参照先と一致している。

## 課題2: MVP UIが公開用デザインに達していない

現状:

- 変換機能は実装済み。
- ただしロードマップのデザイン方針である「ダークモード固定」「シャープでミニマル」「ドロップ領域をファーストビューの主役にする」には未対応。

対策:

- ダークモード固定のUIへ刷新する。
- アクセントカラーは `#2D7CFF` の1色に寄せる。
- グレースケール中心の配色へ整理する。
- ドロップエリアをファーストビューの半分以上にする。
- 変換中、完了、エラーの状態を視覚的に明確に分ける。
- 375px、768px、1280pxでレイアウトが崩れないことを確認する。

実装候補:

- `src/App.tsx`
- `src/App.css`
- `src/index.css`

完了条件:

- 変換ツール本体が初期表示で主役になっている。
- モバイル幅でもファイル名、ボタン、状態表示が重ならない。
- `npm run build` が成功する。

## 課題3: SEOの土台がない

現状:

- `index.html` は最小構成。
- title、description、OGP、canonical、JSON-LD、robots、sitemapが未整備。

対策:

- トップページ向けのtitleとdescriptionを設定する。
- OGPとTwitter Cardを追加する。
- canonical URLを設定する。
- `WebApplication` のJSON-LDを追加する。
- `robots.txt` と `sitemap.xml` を追加する。
- ドメイン決定前は仮URLではなく、設定値で差し替えやすい構造にする。

実装候補:

- `index.html`
- `public/robots.txt`
- `public/sitemap.xml`
- 必要なら `src/lib/seo.ts`

完了条件:

- 主要メタタグが存在する。
- 構造化データがHTMLから確認できる。
- `npm run build` が成功する。

## 課題4: ガイド記事を置く仕組みがない

現状:

- ロードマップではガイド記事3本以上が公開前条件。
- まだ記事ページやMarkdown管理がない。

対策:

- Markdownベースの記事管理を導入する。
- 初期ページとして以下を想定する。
  - `/guide/windows`: WindowsでHEICが開けない問題
  - `/guide/iphone`: iPhoneでHEIC保存をやめる設定
  - `/about/heic`: HEICとは何か
  - `/faq`: よくある質問
- MVPではルーティングを最小限にし、静的ページとしてビルドできる形を優先する。

実装候補:

- `src/content/`
- `src/pages/`
- `src/lib/articles.ts`
- 必要なら `react-router-dom` または軽量な自前ルーティング

完了条件:

- 少なくとも3本のガイド記事が表示できる。
- 記事のtitle、descriptionをページ単位で管理できる。
- sitemapに記事URLを含められる。

## 課題5: 公開前品質チェックが未整備

現状:

- `npm test` と `npm run build` は成功済み。
- レスポンシブ、Lighthouse、実HEIC変換、ネットワーク送信なしの確認は手動項目として残っている。

対策:

- 公開前チェックリストを `docs/release-checklist.md` として作る。
- 手動確認項目を固定化する。
- 実HEICサンプルでJPG、PNG、WebP変換を確認する。
- DevTools Networkで画像アップロードが発生しないことを確認する。

完了条件:

- 公開前に確認すべき項目が文書化されている。
- 実ファイル変換の確認結果を残せる。

## 推奨実施順

1. `ROADMAP.md` の参照整合を直す。
2. 公開用デザイン刷新。
3. SEO基本実装。
4. Markdown記事管理とガイド記事3本。
5. 公開前チェックリストと手動確認。

## 次に着手する推奨タスク

まずは「課題2: MVP UIが公開用デザインに達していない」を対策する。

理由:

- ユーザが最初に触る体験であり、変換サイトとしての信頼感に直結する。
- SEOや記事を入れる前に、トップページの見た目と状態表現を固めたほうが後続実装の手戻りが少ない。
- ロードマップでもMonth 1 Week 1の最初のタスクに位置付けられている。
