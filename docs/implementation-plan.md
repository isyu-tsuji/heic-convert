# MVP実装計画

## 目的

`docs/mvp-spec.md`の仕様に沿って、Vite + React + TypeScriptでブラウザ完結のHEIC変換MVPを実装する。
実装ではサーバ送信を行わず、HEIC/HEIFのデコード、画像エンコード、ZIP生成、ダウンロードをクライアント内で完結させる。

## 変更予定ファイル

プロジェクト設定:

- `package.json`
- `package-lock.json`
- `index.html`
- `vite.config.ts`
- `tsconfig.json`
- `tsconfig.app.json`
- `tsconfig.node.json`

アプリ本体:

- `src/main.tsx`
- `src/App.tsx`
- `src/App.css`
- `src/index.css`

Functional Core:

- `src/lib/types.ts`
- `src/lib/validation.ts`
- `src/lib/outputFormat.ts`
- `src/lib/fileName.ts`
- `src/lib/heicConverter.ts`
- `src/lib/zip.ts`

テスト:

- `src/lib/validation.test.ts`
- `src/lib/fileName.test.ts`
- `src/lib/heicConverter.test.ts`

補助:

- `src/vite-env.d.ts`

## 追加予定依存

本番依存:

- `@vitejs/plugin-react`
- `vite`
- `typescript`
- `react`
- `react-dom`
- `libheif-js`
- `jszip`
- `zod`

開発依存:

- `vitest`
- `@types/react`
- `@types/react-dom`

## 実装順序

1. Vite + React + TypeScriptの最小構成を作る。
2. 依存関係を追加する。
3. 型、バリデーション、ファイル名生成を実装する。
4. `libheif-js`を使うHEIC変換関数を実装する。
5. ZIP生成関数を実装する。
6. React UIでドラッグ&ドロップ、ファイル一覧、形式選択、変換、ZIPダウンロードをつなぐ。
7. VitestでFunctional Coreの単体テストを追加する。
8. `npm test`と`npm run build`で確認する。
9. 開発サーバを起動し、動作確認用URLを共有する。

## 想定リスク

- `libheif-js`の型定義が不足している場合、最小限のローカル型定義が必要になる。
- `libheif-js`のWASM読み込み方式がViteのビルド設定と噛み合わない場合、import方法またはasset設定の調整が必要になる。
- Node上のVitestでは実HEICデコードとCanvasを直接検証しにくいため、変換関数の一部は手動確認に依存する。
- WebP出力はブラウザのCanvas実装に依存する。
- 巨大ファイルや大量ファイルではブラウザのメモリ制限で失敗する可能性がある。

## 実装前チェック

- `docs/mvp-spec.md`のMVP範囲に収める。
- サーバ送信、外部API送信、アナリティクスを入れない。
- 仕様未確定事項はMVP仮決めの範囲だけ使う。
- 関連のないリファクタはしない。
