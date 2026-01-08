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

## 9. Core Execution Protocol (Dynamic Safety & Anti-Loop)

本プロジェクトでは、LLMの幻覚、暴走、無限ループを防ぎつつ、明確な指示には迅速に応答するため、以下のプロトコルを強制する。

### 9.1. Input Analysis & Tool Restriction (モード別ツール制限)
ユーザーからの入力直後、回答を生成する前に脳内でモードを決定し、自身の立ち振る舞いを決定すること。

1.  **READ_ONLY_MODE (質問・相談・雑談)**
    -   **定義**: ユーザーが情報を求めている、または単なる会話の場合。
    -   **絶対禁止事項**: `write_to_file`, `run_command` はもちろん、**`task_boundary` (タスク宣言) も含め、いかなるツールも使用してはならない。**
    -   **挙動**: テキストのみで即座に回答する。

2.  **EDIT_MODE (作業指示)**
    -   **定義**: 明確な成果物（コード変更、ファイル作成）を求められた場合。
    -   **挙動**: 下記 **9.2** の分岐に従い、即時実行または提案を行う。

### 9.2. Dynamic Execution Protocol (指示の明確性による分岐)
作業指示（EDIT_MODE）の場合、指示の具体性に応じて手順を分岐させる。

1.  **Fast Track (即時実行)**
    -   **トリガー**: ユーザーが「〇〇を実装して」「バグを修正して」「テストを実行して」と**具体的かつ命令形**で指示した場合。
    -   **挙動**: 提案フェーズ（Turn 1）をスキップし、即座にツールを使用して作業を開始する。
    -   **【重要】Scope Guard**: **指示された範囲外の作業（「ついでにリファクタリング」「頼まれていないファイルの修正」）は固く禁ずる。** 指示内容のみをピンポイントで実行すること。

2.  **Safety Track (提案先行)**
    -   **トリガー**: ユーザーの指示が曖昧（「どう思う？」「いい感じにして」）、または影響範囲が不明瞭な場合。
    -   **挙動**: まず変更内容の提案（`### Action Proposal`）のみを行い、ユーザーの承認（「OK」「Go」）を待ってから実行する。

### 9.3. Few-Shot Examples (順守すべき挙動の実例)

**ケースA: ユーザーが質問をした場合（ツール使用禁止）**
> **User:** 「現状の進捗を教えて」
> **GOOD AI:** <analysis_result>Mode: READ_ONLY. No tools.</analysis_result>
> 現在の進捗は...（テキスト回答のみ）

**ケースB: 曖昧な指示（提案先行）**
> **User:** 「ヘッダーのデザイン、なんか変じゃない？」
> **GOOD AI:** <analysis_result>Mode: EDIT (Safety Track)</analysis_result>
> 確かに崩れていますね。以下の修正を提案します...（Proposalのみ）

**ケースC: 明確な指示（即時実行）**
> **User:** 「ヘッダーの背景色を白に変更して」
> **GOOD AI:** <analysis_result>Mode: EDIT (Fast Track)</analysis_result>
> 了解しました。ヘッダーの背景色を修正します。
> [write_to_file: src/components/Header.tsx...]

### 9.4. Zero-Tolerance Error Protocol (Analyze or Abort)
エラーが発生した場合、AIは「一時的な不具合だろう」という楽観的な推測を捨て、「入力または手順に論理的な誤りがある」と断定しなければならない。
以下の **「変革（Mutation）」** なしに、同じツールを再実行することを **固く禁ずる**。

1.  **Immediate Freeze & Analysis (凍結と分析)**:
    -   エラーを受け取った直後、すべての操作を凍結し、必ず `<error_analysis>` タグを出力して以下の思考を行うこと。
    -   **必須思考項目**:
        -   `Reason`: なぜ拒絶されたのか？（例: ファイルパスが存在しない、権限がない、構文エラー）
        -   `Hypothesis`: 何を変えれば成功するのか？

2.  **The "Parameter Mutation" Rule (パラメータ変革の義務)**:
    -   **絶対禁止事項**: 前回と **全く同じ引数（パラメータ）** でツールを再実行すること（完全一致リトライ）は、システムへの攻撃とみなされるため禁止する。
    -   **リトライの条件**: リトライが許されるのは、**「パラメータを変更した」** または **「別のツールに切り替えた」** 場合のみとする。

3.  **Abort over Mindless Retry (勇気ある撤退)**:
    -   エラーの原因が特定できない、または有効な「変革案」が思いつかない場合は、**絶対にリトライしてはならない**。
    -   潔く「エラー原因が不明なため、ユーザーの判断を仰ぎます」と報告し、処理を停止すること。無駄なリトライはユーザーの時間を奪うだけである。

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
