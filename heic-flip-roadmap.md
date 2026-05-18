# heic-flip プロジェクト 実行計画

最終更新: 2026-05-18

## プロジェクト概要

**ゴール**: ブラウザ完結のHEIC→JPG/PNG/WebP変換サイトを構築し、副業として月1〜3万円の収益化を目指す。

**予算**: ドメイン代（約1500円/年）のみ。それ以外はすべて無料枠で運用。

**期待値の現実ライン**:
- 3ヶ月後: 月数百〜数千円
- 6ヶ月後: 月3000〜1万円
- 1年後: 月1〜3万円（うまく行けば）

**ペルソナ**: iPhoneで撮った写真をWindows PCに送って開けなくて困っている、ITに詳しくない会社員。

---

## 戦略の前提

### 勝ち筋
- ビッグワード（"heic to jpg"）は捨てる。CloudConvert級の競合に新規で勝てない。
- **日本語 × 特定ニーズ × 明確なペイン** を狙う。
- 「変換ツール」ではなく「**HEIC問題の解決サイト**」として立て付ける。変換はその中核機能。

### 狙うキーワード例
- `heic jpg 一括変換 オフライン`
- `iphone heic windows 開けない`
- `heic exif 残す 変換`
- `heic webp 変換 品質指定`

### サイト構造
```
heicflip.com (仮)
├── /                  ← 変換ツール本体
├── /guide/windows     ← Windowsで開けない問題の解決法
├── /guide/iphone      ← iPhoneでHEICをやめる設定方法
├── /guide/email       ← メール添付で送るときの注意
├── /about/heic        ← HEICとは何か
└── /faq               ← よくある質問
```

---

## デザイン方針

### 全体トーン
- リファレンス: linear.app, vercel.com 系の「シャープでミニマル、余白多め」
- アクセントカラー1色のみ（例: #2D7CFF）。それ以外はグレースケール
- フォント: Inter（sans-serif）+ JetBrains Mono（monospace）
- アニメーション: hoverとファイルドロップ時のみ、200ms以内のtransitionで控えめに
- ダークモード固定（切替トグルなし）

### レイアウト原則
- ファーストビューでドロップエリアが画面の半分以上を占める
- 「変換中」「完了」「エラー」の3ステートを視覚的に明確に分ける
- モバイル(375px幅)でも崩れないこと

### 禁止事項
- グラデーション背景、過剰なシャドウ
- 絵文字の装飾的使用
- ヒーローセクションの長い説明文（HEIC変換は説明不要）

### Codexへの指示例
```
このサイトのデザインを刷新してください。

## デザイン方針
- リファレンス: linear.app, vercel.com のような「シャープでミニマル、余白多め」
- アクセントカラー: 1色だけ使う(#2D7CFF)。それ以外はグレースケール
- フォント: Inter (sans-serif) と JetBrains Mono (monospace) のみ
- ダークモード固定

## 守ること
- ファーストビューでドロップエリアが画面の半分以上を占める
- 「変換中」「完了」「エラー」の3ステートを視覚的に明確に分ける
- モバイル(375px幅)でも崩れない

## やらないこと
- グラデーション背景、過剰なシャドウ、絵文字の装飾的使用
- ヒーローセクションの長い説明文
- ダークモード切替トグル

実装前にUIモック方針(レイアウト、配色、コンポーネント分割)を箇条書きで提示してください。
```

### 使うライブラリ
- **shadcn/ui** を導入（Button, Card, Progress, Toast）
- 公式: https://ui.shadcn.com/docs/installation/vite

### Playwright MCP 活用
Codexに「実装→スクショ→評価→修正」のループを回させる。デザイン品質チェックに有効。

---

## SEO実装

### Codexに依頼するタスク

```
このサイトに以下のSEO/解析対応を実装してください。

1. React Helmet (またはVite対応プラグイン)で動的メタタグ
   - title, description, OGP, Twitter Card

2. JSON-LD 構造化データ
   - トップ: WebApplication スキーマ
   - FAQページ: FAQPage スキーマ

3. sitemap.xml と robots.txt を自動生成

4. Cloudflare Web Analytics の埋め込み (script tag のみ)

5. Core Web Vitals 最適化
   - LCP, FID, CLS が green になることを確認
   - 不要JSバンドルの削減 (treeshaking確認)

6. canonical URL 設定

実装前にディレクトリ構成と影響範囲を提示してください。
```

### 補足
- 新規サイトのGoogle評価安定まで最低3〜6ヶ月。長期戦。
- 短期流入はSNS/技術記事に頼る（後述）。

---

## 収益化

### 1. Google AdSense（メイン）
- 変換サイトのRPM目安: 100〜300円/1000PV
- 月1万PVで月1000〜3000円
- 月5万PVで月5000〜1.5万円

**審査通過のための条件**:
- ガイド記事5本以上揃えてから申請
- 変換ツールだけだとコンテンツ薄で落ちる
- 審査期間: 通常2週間〜1ヶ月

**配置ルール**:
- 変換ボタンから物理的に離す（誤クリック誘発は規約違反）

### 2. アフィリエイト（サブ）
- **Amazonアソシエイト**: iPhoneケース、SDカード、外付けSSD
- **A8.net / もしも**: クラウドストレージ系（Dropbox等）
- AdSenseと併用可能

### 3. 中長期検討
- noteの有料記事（「HEIC問題完全ガイド」を500円販売）
- Buy Me a Coffee（寄付ボタン）

---

## インフラ構成（ゼロ円運用）

| 項目 | サービス | 費用 |
|---|---|---|
| ホスティング | Cloudflare Pages | 0円 |
| ドメイン | Cloudflare Registrar | 約1500円/年 |
| DNS/CDN | Cloudflare | 0円 |
| SSL | Cloudflare自動 | 0円 |
| GitHub | 無料プラン | 0円 |
| アクセス解析 | Cloudflare Web Analytics | 0円 |
| 広告 | Google AdSense | 0円 |
| **合計** | | **約1500円/年** |

### デプロイ手順
1. Cloudflare でドメインを取得
2. Cloudflare Pages にプロジェクトをGitHub連携でデプロイ
3. Pagesのカスタムドメイン設定で紐付け
4. SSL証明書は自動発行

初回所要時間: 慣れていなくても約2時間。

### ドメイン候補
- `heicflip.com` — 短い、覚えやすい（推奨）
- `heic.studio` — `.studio` で意味が通る
- `heicto.app` — 「HEIC to ...」を連想

**避けるべき**:
- ハイフン入り
- 数字混じり
- `.xyz` `.online` などの安TLD

---

## 3ヶ月ロードマップ

### Month 1: 基盤完成
| 週 | タスク |
|---|---|
| 1 | デザイン刷新（Codex） |
| 2 | SEO基本実装（Codex） |
| 3 | ガイド記事3本執筆（HEICとは / Windows問題 / iPhone設定） |
| 4 | デプロイ + Cloudflare設定 + ドメイン取得 |

→ 月末に公開、Cloudflare Analyticsで計測開始

### Month 2: コンテンツ拡充 + 流入施策
| 週 | タスク |
|---|---|
| 1-2 | ガイド記事を追加5本（FAQ、トラブルシューティング） |
| 3 | Zenn/Qiitaに技術記事「WASMでHEIC変換サイトを作った話」 |
| 4 | X(旧Twitter)で告知、Product Hunt投稿検討 |

### Month 3: 収益化準備 + 改善
| 週 | タスク |
|---|---|
| 1 | AdSense申請 |
| 2 | Search Consoleの流入クエリから記事追加 |
| 3 | 競合の弱いキーワードを発見→記事追加 |
| 4 | アフィリエイト導入 |

---

## 築地さんの強みを活かす並行施策

技術記事を書けるアドバンテージを活用:

- サイト本体は収益化を狙う
- Zenn/Qiitaに技術記事を継続的に投稿
  - 「Codex CLI で WASM サイトを作った」
  - 「ブラウザ完結でHEIC変換を実装した話」
  - 「Vite + libheif-js のハマりどころ」
- 技術記事は数日〜1ヶ月で順位安定するので、サイト本体のSEO評価が育つまでの「つなぎ」として機能

---

## 直近やること（優先度順）

1. **ドメイン名を決定** （`heicflip.com` / `heicto.app` etc.）
2. **デザイン刷新をCodexに依頼**（このドキュメントの「Codexへの指示例」をそのまま投げる）
3. **SEO基本実装をCodexに依頼**（同上）
4. **最初のガイド記事を1本書く**（ペース感とトンマナを掴む）
5. **コンテンツ拡張機能をCodexに作らせる**（Markdownベースの記事管理）

---

## チェックリスト

### 公開前
- [ ] ドメイン取得
- [ ] デザイン刷新完了
- [ ] レスポンシブ確認（375px / 768px / 1280px）
- [ ] Lighthouse スコア90以上
- [ ] メタタグ・OGP・JSON-LD 設定
- [ ] sitemap.xml / robots.txt
- [ ] Cloudflare Web Analytics 埋め込み
- [ ] ガイド記事3本以上

### 公開後1ヶ月以内
- [ ] Google Search Console 登録
- [ ] Bing Webmaster Tools 登録
- [ ] Zenn/Qiita 技術記事1本投稿
- [ ] X で告知投稿
- [ ] Core Web Vitals が green であることを確認

### 公開後2〜3ヶ月
- [ ] ガイド記事8本以上
- [ ] AdSense 申請
- [ ] Amazonアソシエイト登録
- [ ] 月間PV計測、流入キーワード分析
