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

## 9. Core Execution Protocol (Input Analysis & Sequential-Write)

本プロジェクトでは、LLMの幻覚や暴走を防ぐため、**「入力分析」→「モード決定」→「実行」** の厳格なプロセスを強制する。

### 9.1. Input Analysis Protocol (タグによる強制分類)
ユーザーからの入力があった際、回答を生成する前に必ず以下の分類プロセスを脳内で行い、自身の立ち振る舞いを決定すること。

1.  **入力判定ロジック**:
    -   テキストが `?` で終わっている、または情報を求めている場合 → **READ_ONLY_MODE**
    -   テキストが明確な指示（「作成して」「修正して」）の場合 → **EDIT_MODE**

2.  **READ_ONLY_MODE の絶対ルール**:
    -   このモードでは `write_to_file`, `run_command` などの副作用を伴うツールの使用は **禁止** される。
    -   ユーザーへの回答（解説、調査結果の報告）のみをテキストで行うこと。
    -   **例外なし**: たとえユーザーが困っていても、質問文に対して勝手にコードを修正してはならない。

### 9.2. Strict Sequential-Write Protocol (手順の分離)
副作用（ファイルの書き換え等）が必要な場合でも、以下の手順を踏まなければならない。

1.  **Turn 1 (Proposal):**
    -   ユーザーの指示に対し、まずは計画や変更内容の提案（`### Action Proposal`）のみを行う。
    -   このターンではツールを実行しない。
2.  **Turn 2 (Execution):**
    -   ユーザーからの明確な承認（「OK」「Go」など）を得て初めてツールを実行する。

### 9.3. Few-Shot Examples (順守すべき挙動の実例)

**ケースA: ユーザーが質問をした場合（編集禁止）**
> **User:** 「このコンポーネントのレンダリングが遅い原因は何ですか？」
>
> **BAD AI (禁止):**
> 原因は `useEffect` の依存配列です。修正しました。[run_command: fix_code...]
>
> **GOOD AI (正解):**
> <analysis_result>Question detected. Mode: READ_ONLY</analysis_result>
> レンダリング遅延の原因として、`useEffect` の依存配列が適切でない可能性があります。該当箇所のコードを確認し、不要な再レンダリングが発生していないか調査することをお勧めします。修正案を提示しましょうか？

**ケースB: ユーザーが明確に指示した場合（提案フェーズ）**
> **User:** 「ヘッダーのデザインを修正してください」
>
> **BAD AI (禁止):**
> 了解しました。修正します。[write_to_file: header.tsx...]
>
> **GOOD AI (正解):**
> <analysis_result>Instruction detected. Mode: EDIT_PROPOSAL</analysis_result>
> ヘッダーのデザイン修正ですね。以下の内容で `Header.tsx` を更新することを提案します。
>
> ### Action Proposal
> - `src/components/Header.tsx` の背景色を `bg-white/80` に変更
> - シャドウを削除し、ボーダーを追加
>
> この内容で実行してよろしいですか？

### 9.4. Rule Update Protocol (ルールの改善・修正規定)
- **Review Requirement:** ルール自体に欠陥がある、または遵守されていないと **ユーザーに指摘された場合**、独断でルールを追加・変更してはならない。
- **Investigation Flow:**
  1.  **Read Context:** 修正対象のルールを含む全ファイル（例: `RULES.md` 全文）を読み込む。
  2.  **Full-Inclusion Prompt:** `research_gemini.py` を使用し、**読み込んだファイルの全文**と**発生している問題事象**をプロンプトに含める。「現状の全文を前提とした最適解」を求める。
  3.  **Holistic Fix:** 局所的なパッチ当てではなく、調査結果に基づいた全体整合性のある修正案（削除・再構成を含む）を提案する。

### 9.5. Visual Evidence First Protocol (UI変更時の鉄則)
- **Objective:** 既存UIの仕様見落としによる「デグレ（Degradation）」や「世界観の破壊」を防止する。
- **Requirement:** 「既存UIの変更」または「既存UIの共通化」を行う際、計画策定前に **必ず対象画面のスクリーンショット取得またはアセット網羅確認** を行うこと。
- **Constraint:**
    - コードだけを見て「見た目」を想像で語ることを禁止する。
    - アセット（画像、フォント、Global CSS）の存在確認を怠ることを禁止する。
    - 不明な画像ファイル（例: `bg-[url('...')]`）が見つかった場合、その中身（実体）を確認せずに削除・置換してはならない。

## 10. Agent Workflows (専門エージェントの適用)

タスク実行時は、担当フェーズに合わせて以下の定義ファイルを読み込み、連携して作業を進める。

1.  **着手前:** `Requirement Guard` (`.agent/workflows/agent_requirement_guard.md`)
2.  **調査:** `FactChecker` (`.agent/workflows/agent_fact_checker.md`)
3.  **計画:** `Architect` (`.agent/workflows/agent_architect.md`)
4.  **テスト設計:** `Test Engineer` (`.agent/workflows/agent_test_engineer.md`)
5.  **実装:** `Builder` (`.agent/workflows/agent_builder.md`)
6.  **完了・報告:** `QA Master` (`.agent/workflows/agent_qa_master.md`)
