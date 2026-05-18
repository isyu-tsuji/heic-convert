# 技術要件: HEIC変換サイト

作成日: 2026-05-18
前のドキュメント: [[02_ビジネス要件_HEIC変換サイト]]

## 技術スタック

- フロントエンド: Vite + React + TypeScript
- HEICデコード: libheif-js
- 変換処理: Browser File API + Canvas API
- ZIP生成: jszip
- 入力検証: zod
- テスト: Vitest

## アーキテクチャ方針

Functional Core / Imperative Shellの分離を意識する。

Functional Core:

- 入力ファイルの検証。
- 出力形式の定義。
- 出力ファイル名生成。
- HEICデコードと画像Blob生成。
- ZIPエントリ名の重複回避。

Imperative Shell:

- ドラッグ&ドロップイベント。
- ファイル選択イベント。
- `File.arrayBuffer()`の呼び出し。
- React状態管理。
- `URL.createObjectURL()`によるダウンロード。
- DOM上のクリックイベントによるZIP保存。

## 型設計

主要型:

- `HeicFile`: バリデーション済みのHEIC/HEIFファイルを表すBranded Type。
- `OutputFormat`: `jpg | png | webp`。
- `ConvertedBlob`: 変換済み画像Blobを表すBranded Type。
- `ConversionStatus`: `pending | converting | done | failed`。
- `ConversionJob`: UI上の変換単位。

## 入力検証

Zodで境界バリデーションを行う。

検証内容:

- 入力が`File`であること。
- 拡張子が`.heic`または`.heif`であること。
- MIMEタイプが空、`image/heic`、`image/heif`のいずれかであること。

MIMEタイプはブラウザやOSによって空になる場合があるため、拡張子も併用して判定する。

## 変換処理

処理フロー:

1. `HeicFile`から`ArrayBuffer`を取得する。
2. `libheif-js`でHEIC/HEIFをデコードする。
3. デコード結果をRGBAピクセルデータとして取り出す。
4. Canvasへ描画する。
5. Canvasの`toBlob`でJPG、PNG、WebPへエンコードする。
6. 生成されたBlobを`ConvertedBlob`として返す。

品質:

- JPG: `0.92`
- WebP: `0.92`
- PNG: 品質指定なし

## ZIP生成

- `jszip`で変換成功ファイルのみをZIPに追加する。
- 同名ファイルがある場合は`name-1.jpg`のように連番を付ける。
- ZIP Blobを生成し、ブラウザのダウンロードとして保存する。

## セキュリティ・プライバシー

- 画像ファイルをサーバへ送信しない。
- 外部APIへ画像データを送信しない。
- 認証、課金、アナリティクスはMVPでは実装しない。
- 変換処理はブラウザメモリ内で完結する。

## テスト方針

Vitestで確認すること:

- HEIC/HEIFファイル判定。
- 出力形式とMIMEタイプ、拡張子の対応。
- 出力ファイル名生成。
- ZIP内ファイル名の重複回避。
- 変換失敗時に理由を返すこと。

手動確認すること:

- 実HEICファイルのドラッグ&ドロップ。
- 複数ファイル変換。
- JPG、PNG、WebP出力。
- ZIPダウンロードと展開。
- ネットワークタブで画像アップロードが発生しないこと。

## 実装リスク

- `libheif-js`の型定義が不足している可能性がある。
- Vite環境でWASMの読み込み調整が必要になる可能性がある。
- Node上のテストではCanvasと実HEICデコードの完全な検証が難しい。
- WebP出力はブラウザのCanvas対応状況に依存する。
- 大量ファイルや巨大ファイルではメモリ不足になる可能性がある。
