# デプロイ手順: HEIC変換サイト

作成日: 2026-05-18
対象: heic-flip
参照: [[03_技術要件_HEIC変換サイト]] / [[02_ビジネス要件_HEIC変換サイト]]

## 目的

このメモは、今回のHEIC変換サイトをどの手順で公開するかをまとめたもの。
このアプリはブラウザ内完結の静的サイトなので、APIサーバは不要。
本番公開では `npm run build` で作った静的成果物をCDN/静的ホスティングへ置く。

## 結論

推奨デプロイ先は Cloudflare Pages。

理由:

- 静的サイトに向いている
- HTTPSとCDNが標準
- 無料枠で運用しやすい
- 今回の構成は `dist/` を配るだけで成立する

## このプロジェクトのビルド成果物

- 入力: `index.html`, `src/*`, `public/*`
- ビルドコマンド: `npm run build`
- 出力先: `dist/`
- 配布物: `dist/` 以下の静的ファイル一式

注意:

- `libheif-js` はWASMを含むため、初回ロードで少し重い
- ただし処理自体はブラウザ内で完結する
- サーバ側でHEICファイルを受け取る構成ではない

## 推奨公開手順: Cloudflare Pages

### 1. Git リポジトリを用意する

ローカル変更をGitHubにpushできる状態にする。
最低限、mainブランチが存在していればよい。

### 2. Cloudflare Pages を作成する

CloudflareダッシュボードでPagesプロジェクトを作成する。
接続元はGitHubリポジトリを選ぶ。

設定値:

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `.`

### 3. デプロイする

初回デプロイはCloudflareがリポジトリをビルドして配置する。
以後はmainブランチへのpushで自動デプロイされる。

### 4. 動作確認する

公開後に以下を確認する。

- トップページが表示される
- ファイル選択が動く
- ドラッグ&ドロップが動く
- 複数ファイル追加が動く
- 変換後ZIPのダウンロードが動く
- DevToolsのNetworkで画像アップロードが発生していない

## 独自ドメインを後で足す場合

今回はドメイン未確定なので、まずはCloudflare Pagesの一時URLで公開してよい。
独自ドメインを決めたら、PagesのCustom Domainsに追加する。

対応時に見直すもの:

- `index.html` の canonical
- `index.html` の `og:url`
- `public/robots.txt` の `Sitemap`
- `public/sitemap.xml` の `loc`

## 代替案

### Vercel

向いているケース:

- とにかく早く公開したい
- Viteの静的サイトをそのまま置きたい

設定値:

- Build command: `npm run build`
- Output directory: `dist`

補足:

- こちらも静的サイト運用としては十分
- Cloudflare Pagesよりも、今回はCloudflare寄りの方針と相性がよい

### GitHub Pages

向いているケース:

- 完全にGitHub中心で運用したい
- 独自ドメインなしでよい

注意:

- SPAのルーティングやアセット配置で少し手当が必要になる
- 今回のMVPはルート1枚のツールなので運用可能だが、Pagesより手間が増える

## ローカル確認手順

本番に上げる前に、ローカルで以下を確認する。

```bash
npm install
npm test
npm run build
npm run dev
```

確認ポイント:

- `npm test` が通る
- `npm run build` が通る
- `dist/` が生成される
- `npm run dev` でトップ画面が開く

## 事故を避けるチェック

- 画像ファイルをサーバへ送るコードが入っていないか
- `public/robots.txt` と `public/sitemap.xml` のURLが実ドメインに合っているか
- canonical が本番URLと一致しているか
- `libheif-js` のWASMが本番でも読み込めるか
- モバイルでドロップ領域が崩れていないか

## 公開前の最終手順

1. `npm test`
2. `npm run build`
3. 生成物の `dist/` を確認
4. Cloudflare Pages にpush
5. 本番URLで画面確認
6. 実HEICファイルで変換確認
7. ZIPダウンロード確認

## いまの実務判断

このアプリはバックエンドを持たないので、デプロイは「静的ファイルを置く」だけでよい。
したがって、アプリ実装よりも運用面では以下が重要になる。

- `dist/` が壊れずに作れること
- WAFやサーバ設定でWASM配信が止まらないこと
- 本番URLに合わせてメタ情報を更新すること
