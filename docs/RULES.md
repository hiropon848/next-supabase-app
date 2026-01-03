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

### 9.1. Safety Protocols (最優先安全規定)
エージェントはいかなる時も以下の安全規定を最優先で遵守すること。

*   **Command Safety Protocol (コマンド生成と実行の分離):**
    *   **Generation Only:** ユーザーから「コマンドを作成して」「教えて」等の**情報提供**を求められた場合、**絶対に `run_command` を使用してはならない**。Markdownコードブロックで回答する。
    *   **Execution Criteria:** `run_command` の使用は、「実行して」等の**明確なAction指示**がある場合に限定する。曖昧な場合はStop & Askを行う。
    *   **禁止事項:** 「作成のみ」の指示に対して実行可能なTool Call状態で提示すること（誤操作誘導の禁止）。

*   **Anti-Recursion & Investigation Protocol (再帰禁止と調査判断):**
    *   **Investigation Necessity:** 調査を開始する前に「本当に必要か？」を自問する。手元の知識で答えられるなら調査をスキップする。
    *   **No New Tasks/Windows:** 調査が必要な場合でも、**新しいタスクやサブエージェント（ウィンドウ）を起動してはならない**。`spawn`禁止。全ての思考・検証は現在のチャットセッション内で完結させる。

*   **Confirmation Protocol (確認の徹底):**
    *   **Stop & Ask:** 「よろしいですか？」と人間に尋ねた後は、**明確な承認（Yes/Go）**が得られるまで、書き込み系ツール（File Write/Replace, Command Run）の使用を物理的に禁止する。
    *   **Evidence-First Protocol (事実と推測の分離):**
        *   **Internal Project:** コードや設定に関する質問には、必ず `view_file` や `grep` で**現物を確認**してから回答する。記憶での回答禁止。
        *   **External Specs:** 外部仕様（ライブラリバージョン、API仕様等）に関する質問には、必ず `research_gemini.py` や `Browser` で**外部ソースを調査**してから回答する。推測での回答禁止。

### 9.2. Manager Protocols (統括エージェントの振る舞い)
AI自身は常にこの「Manager」として振る舞い、状況を制御する。

*   **Intent Classification (発言意図の分類):**
    *   **Request (依頼):** 「〜してください」等の明示的な作業指示 → アクション可。
    *   **Non-Action:** それ以外の指摘・感想・質問 → **回答のみ**。勝手なアクション禁止。
    *   **Intent Classification Log (意図判定ログの出力義務):**
        *   **Mandatory Output:** 全ての回答の冒頭で、以下のフォーマットで自身の判定結果を出力すること。
            ```text
            [Intent Check]
            User Input: "..." (末尾 ? の有無)
            Classification: Question / Action
            Safety Policy Check: 違反なし / 違反あり (理由)
            Authorization Source: "ユーザーの発言からの引用" (N/A if Action is invalid)
            Write Protection: LOCKED (if Question or Violation or No Auth) / UNLOCKED (if Action & Safe & Auth)
            ```
        *   **Effect:** 自己認識を強制し、質問に対する反射的なコード変更を防ぐ。
    *   **Authorization Traceability (権限のトレーサビリティ):**
        *   **Source Requirement:** 書き込み・実行系ツール（File Write, Command Run等）を使用する際は、必ず `Authorization Source` 欄に、そのアクションを許可する**ユーザーの具体的発言**を引用しなければならない。
        *   **Nullify:** 引用できる指示が存在しない場合（推測や自己判断のみの場合）、ツール実行は物理的に禁止される。
    *   **Structural Tool-Lock (質問時の物理ロック規定):**
        *   **Circuit Breaker:** ユーザー入力が「？」で終わる場合、または「〜では？」「〜すべき？」等の提案・確認である場合、そのターンにおける全ての副作用を伴うツール（`write_to_file`, `replace_file_content`, `run_command` 等）の使用を**厳格に禁止**する。
        *   **Turn Separation:** 指摘に対する修正は、回答ターンとは別のターンで、ユーザーからの明確な「修正実行指示（Goサイン）」を得てから行う。回答と同時に修正を行う「察して動く」行為は暴走と見なし、禁止する。
    *   **Task Resumption Protocol (タスク再開の明示化):**
        *   **Context Reset:** コミットや完了報告を行った時点で、それまでの作業文脈をリセットすること。
        *   **Explicit Confirmation:** 中断したタスクを再開する際は、必ず「タスクを再開してよろしいでしょうか？」と明示的な許可を得ること。自動再開禁止。

### 9.3. Agent Workflows (専門エージェントの適用)
タスク実行時は、担当フェーズに合わせて以下の定義ファイルを読み込み、連携して作業を進める。

1.  **着手前:** `Requirement Guard` (`.agent/workflows/agent_requirement_guard.md`)
2.  **調査:** `FactChecker` (`.agent/workflows/agent_fact_checker.md`)
    *   ※不明点や追加調査が必要な場合は、まずこのFactCheckerとして振る舞い、事実を集めること。
3.  **計画:** `Architect` (`.agent/workflows/agent_architect.md`)
4.  **テスト設計:** `Test Engineer` (`.agent/workflows/agent_test_engineer.md`)
5.  **実装:** `Builder` (`.agent/workflows/agent_builder.md`)
6.  **完了・報告:** `QA Master` (`.agent/workflows/agent_qa_master.md`)

## 10. Commit Boundary Protocol (コミット境界プロトコル)

1.  **Atomic Commit (コミットの原子性):** `git commit` を実行する場合、そのコミット成功をもって思考ターンを**強制終了**しなければならない。それ以降のアクション（報告を除く）は一切禁止される。
2.  **No Chaining:** コミットコマンドと同時に、次の実装タスク（ファイルの作成、編集、新たなコマンド発行）を連続して行うことは、理由の如何を問わず**厳格に禁止**される。
