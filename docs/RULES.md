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

## 9. Core Execution Protocol (Sequential-Write Enforced)

本プロジェクトでは、すべての副作用を伴うアクション（書き込み・コマンド実行）は、**必ずユーザーの承認を挟んだ別ターン**で実行することを物理的に強制する。

### 9.1. Safety Protocols (最優先安全規定)
- **Generation Only:** ユーザーから情報提供を求められた場合（「コマンドを作成して」「教えて」等）、`run_command` ツールを**絶対に**使用してはならない。必ずMarkdownコードブロックで回答すること。

### 9.2. Strict Sequential-Write Protocol (強制プロトコル)
本プロトコルはシステムアーキテクチャによって強制され、AIエージェントの推論における最重要制約となる。

1.  **PASSIVE_MODE (回答と提案の分離):**
    -   エージェントは常にこのモードで開始し、ユーザーの発言意図（質問、指摘、依頼）に関わらず、**回答を生成するターンで、いかなる副作用のあるツールも同時に呼び出してはならない**。
    -   **副作用のあるツール:** `write_to_file`, `replace_file_content`, `run_command`、その他の永続的な変更を加えるツール。
    -   ユーザーの質問（?で終わる発言）や指摘には、このモードで**テキスト回答のみ**を行い、ツールの実行は物理的にロックされる。
2.  **Action Proposal (実行提案):**
    -   作業が必要な場合、回答を完結させた**別のターン**で、実行したい作業内容を `### Action Proposal` ブロックとして提示しなければならない。
3.  **EXECUTION_MODE (承認後の実行):**
    -   Action Proposal に対し、ユーザーから **明確な承認（Go / Yes）** が得られた場合のみ、次のターンで提案内容の実行を開始し、`write` や `run_command` の実行が許可される。

### 9.3. Circuit Breaker (強制ロック規定)
- **ユーザー入力が『？』で終わるターン、またはユーザーの指摘・確認に対する回答のターンでは、ツール実行は物理的に不可能である。**
- エージェントは、この物理的制約を認知し、回答ターンでは必ず**テキストによる情報出力**を優先すること。


### 9.4. Rule Update Protocol (ルールの改善・修正規定)
- **Review Requirement:** ルール自体に欠陥がある、または遵守されていないと **ユーザーに指摘された場合**、独断でルールを追加・変更してはならない。
- **Investigation Flow:**
  1.  **Read Context:** 修正対象のルールを含む全ファイル（例: `RULES.md` 全文）を読み込む。
  2.  **Full-Inclusion Prompt:** `research_gemini.py` を使用し、**読み込んだファイルの全文**と**発生している問題事象**をプロンプトに含める。「現状の全文を前提とした最適解」を求める。
  3.  **Holistic Fix:** 局所的なパッチ当てではなく、調査結果に基づいた全体整合性のある修正案（削除・再構成を含む）を提案する。

## 10. Agent Workflows (専門エージェントの適用)

タスク実行時は、担当フェーズに合わせて以下の定義ファイルを読み込み、連携して作業を進める。

1.  **着手前:** `Requirement Guard` (`.agent/workflows/agent_requirement_guard.md`)
2.  **調査:** `FactChecker` (`.agent/workflows/agent_fact_checker.md`)
3.  **計画:** `Architect` (`.agent/workflows/agent_architect.md`)
4.  **テスト設計:** `Test Engineer` (`.agent/workflows/agent_test_engineer.md`)
5.  **実装:** `Builder` (`.agent/workflows/agent_builder.md`)
6.  **完了・報告:** `QA Master` (`.agent/workflows/agent_qa_master.md`)
