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

品質チェックは以下の順序で実行するが、**開発サーバー(`npm run dev`)との競合**に厳重に注意すること。

1. **Formatter**: Prettier を使用し、コードフォーマットを統一する（`.prettierrc` の設定に準拠）。コミット前に整形を行うこと。
2. **Linting**: コミット前に必ず `npm run lint` を実行し、警告やエラーがない状態にする。
3. **Type Checking**: コミット前に `npx tsc --noEmit` を実行し、型エラーがないことを確認する。
4. **Build Check (排他制御必須)**:
    - 最終的な整合性確認として `npm run build` を実行する。
    - **【重要禁止事項】**: **`npm run dev` (開発サーバー) が起動している状態では、絶対に `npm run build` を実行してはならない。**
    - **理由**: ビルドプロセスが `.next` フォルダ（キャッシュ）を削除・再生成するため、起動中のサーバーが参照先を失い、ブラウザ検証時にCSS剥がれや404エラーを引き起こすため。
    - **手順**:
        - **UI確認・ブラウザ検証中**: ビルドチェックはスキップし、開発サーバーでの動作確認を優先する。
        - **作業完了時**: 開発サーバーを**停止してから**、ビルドチェックを実行する。

## 7. Git ワークフロー

- **承認フロー**: **コミットおよびプッシュは、必ず事前にユーザーの明示的な許可を得ること。** AIによる自動的な、あるいは確認なしのコミットは禁止。
- **コミットメッセージ**: 日本語で記述する（例: `feat: ログイン機能の実装`, `fix: バグ修正`）。
- **粒度**: 変更は論理的な単位で細かくコミットする。

## 8. セキュリティ

- **機密情報**: `.env.local` などの環境変数ファイルは絶対にコミットしない（`.gitignore` を確認）。
- **ローカル設定**: `.agent` などのローカル固有の設定ファイルはコミットしない。

## 9. Core Execution Protocol (Input Analysis & Anti-Loop)

本プロジェクトでは、LLMの幻覚、暴走、および**システムエラーによる無限ループ**を防ぐため、以下のプロトコルを強制する。

### 9.1. Input Analysis & Tool Restriction (モード別ツール制限)
ユーザーからの入力直後、回答を生成する前に脳内でモードを決定し、**使用可能なツールを物理的に制限**すること。

1.  **READ_ONLY_MODE (質問・相談・雑談)**
    -   **定義**: ユーザーが情報を求めている、または単なる会話の場合。
    -   **絶対禁止事項**: `write_to_file`, `run_command` はもちろんのこと、**`task_boundary` (タスク開始宣言) も含め、いかなるツールも使用してはならない。**
    -   **挙動**: 純粋なテキストのみで即座に回答を出力する。
    -   *理由*: 些細な会話でタスク管理ツールを使用すると、システムが `current task scope is too simple` エラーを返し、無限ループの原因となるため。

2.  **EDIT_MODE (作業指示)**
    -   **定義**: 明確な成果物（コード変更、ファイル作成）を求められた場合。
    -   **挙動**: 必要であれば `task_boundary` を使用してもよいが、実際の書き込みは承認を得てから行う（下記 9.2 参照）。

### 9.2. Strict Sequential-Write Protocol (手順の分離)
副作用（ファイルの書き換え等）が必要な場合でも、以下の手順を踏まなければならない。

1.  **Turn 1 (Proposal):**
    -   ユーザーの指示に対し、まずは計画や変更内容の提案（`### Action Proposal`）のみを行う。
    -   このターンではツールを実行しない。
2.  **Turn 2 (Execution):**
    -   ユーザーからの明確な承認（「OK」「Go」など）を得て初めてツールを実行する。

### 9.3. Few-Shot Examples (順守すべき挙動の実例)

**ケースA: ユーザーが質問をした場合（ツール使用禁止）**
> **User:** 「現状の進捗を教えて」
>
> **BAD AI (ループの原因):**
> [task_boundary: check_status] -> Error: Too simple -> [Retry] -> Loop...
>
> **GOOD AI (正解):**
> <analysis_result>Mode: READ_ONLY. No tools allowed.</analysis_result>
> 現在の進捗は以下の通りです...（テキストのみで回答）

**ケースB: ユーザーが明確に指示した場合（提案フェーズ）**
> **User:** 「ヘッダーのデザインを修正してください」
>
> **GOOD AI (正解):**
> <analysis_result>Mode: EDIT_PROPOSAL</analysis_result>
> ヘッダーのデザイン修正ですね。以下の内容で更新することを提案します。
>
> ### Action Proposal
> - `src/components/Header.tsx` の背景色を変更
>
> この内容で実行してよろしいですか？

### 9.4. Error Recovery Protocol (無限ループ防止)
- **Stop on Error:** ツール実行時にエラー（特に `scope is too simple` や `rejected`）が返ってきた場合、**絶対に同じツールでリトライしてはならない**。
- **Fallback:** エラーが発生したら、即座にツール使用を諦め、テキストのみの対話（ユーザーへの状況報告や確認）に切り替えること。

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
