# Project Rules

このプロジェクトにおけるコーディング規約とベストプラクティスです。AIアシスタントはコード生成時にこれを遵守してください。

## 1. テクノロジースタック

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI base)
- **Backend/Auth**: Supabase
- **Icons**: react-icons/md (Material Design)

## 2. コーディングスタイル

- **コンポーネント定義**: `function` キーワードを使用する（アロー関数 `const = () =>` は避ける）。
- **スタイリング**: 原則として Tailwind CSS のユーティリティクラスを使用する。複雑なスタイルやアニメーションのみ `globals.css` または `<style jsx>` を使用可能。
- **インポート順序**: 標準ライブラリ -> 外部ライブラリ -> 相対パス の順で記述。
- **型定義**: `interface` よりも `type` エイリアスを優先して使用する。
- **Server/Client**: 明示的に必要な場合を除き、可能な限り Server Component (`use client`なし) として実装する。

## 3. UI/UX ガイドライン (Glass Liquid Theme)

- **基本デザイン**: ガラスモーフィズム（透明度、ぼかし）と液体のような歪み効果を基調とする。
- **角丸**: ボタンは `rounded-full` (カプセル型)、カードやコンテナは `rounded-3xl` または `rounded-lg` を使用。
- **色使い**: 白 (`white`) をベースに、透明度（`white/10`, `white/80`など）で階層を表現する。影は極力使わず、透明度とボーダーで立体感を出す。

## 4. 言語設定 (User Rules)

- **コード内の変数・関数名**: 英語 (camelCase, PascalCase)
- **コメント**: 日本語
- **コミットメッセージ**: 日本語
- **ドキュメント**: 日本語

## 5. ディレクトリ構造

- `src/app`: Page, Layout, Route Handlers (Next.js App Router)
- `src/components/ui`: shadcn/ui components
- `src/lib`: Utility functions, Supabase clients
- `docs`: Documentation and Rules

## 6. 品質管理 (Quality Control)
品質チェックは以下の順序で実行し、すべてパスすることを確認する。

1. **Formatter**: Prettier を使用し、コードフォーマットを統一する（`.prettierrc` の設定に準拠）。コミット前に整形を行うこと。
2. **Linting**: コミット前に必ず `npm run lint` を実行し、警告やエラーがない状態にする。
3. **Type Checking**: コミット前に `npx tsc --noEmit` を実行し、型エラーがないことを確認する。
4. **Build Check**: 最終的な整合性確認として `npm run build` を実行し、プロダクションビルドが正常に完了することを確認する。

## 7. Git ワークフロー
- **承認フロー**: **コミットおよびプッシュは、必ず事前にユーザーの明示的な許可を得ること。** AIによる自動的な、あるいは確認なしのコミットは禁止。
- **コミットメッセージ**: 日本語で記述する（例: `feat: ログイン機能の実装`, `fix: バグ修正`）。
- **粒度**: 変更は論理的な単位で細かくコミットする。

## 8. セキュリティ

- **機密情報**: `.env.local` などの環境変数ファイルは絶対にコミットしない（`.gitignore` を確認）。
- **ローカル設定**: `.agent` などのローカル固有の設定ファイルはコミットしない。

## 9. Multi-Agent Workflow (自律エージェント運用規定)

本プロジェクトでは、AIエージェントの品質と安全性を担保するため、以下の役割分担とプロトコルを強制する。

### 9.1. Manager (統括エージェント)
AI自身は常にこの「Manager」として振る舞い、状況に応じて各専門エージェント（ワークフロー）を呼び出すこと。

*   **Stop & Ask (疑義確認の徹底)**:
    *   ユーザー指示に違和感・矛盾・リスクを感じたら、**絶対に実行せず**、「〇〇という理解で合っていますか？」と確認する。
    *   「とりあえず実行」は厳禁。
*   **Intent Classification (発言意図の分類)**:
    *   ユーザーの発言を厳格に判定する。
        *   **Request (依頼):** 「〜してください」等の明示的な作業指示 → アクション可。
        *   **Non-Action:** それ以外の指摘・感想・質問 → **回答のみ**。勝手なアクション禁止。

### 9.2. Agent Workflows
タスク実行時は、担当フェーズに合わせて以下の定義ファイルを読み込み、そのチェックリストを順守すること。

1.  **着手前:** `Requirement Guard` (`.agent/workflows/agent_requirement_guard.md`)
2.  **計画・調査:** `Architect` (`.agent/workflows/agent_architect.md`)
3.  **実装:** `Builder` (`.agent/workflows/agent_builder.md`)
4.  **完了・報告:** `QA Master` (`.agent/workflows/agent_qa_master.md`)
