# View/Logic Separation Improvement Plan

## 概要

`docs/RULES.md` に定義された **View/Logic Separation** ルールに基づき、現在 View コンポーネント (`page.tsx`) に混在しているロジックを Custom Hooks に分離します。
これにより、コードの可読性、再利用性、およびテスト容易性を向上させます。

## 対象スコープ

以下の3ファイルをリファクタリング対象とします。

1.  **Signup Page**: `src/app/(auth)/signup/page.tsx`
2.  **Login Page**: `src/app/(auth)/login/page.tsx`
3.  **Verified Page**: `src/app/(auth)/verified/page.tsx`

## 実装方針

### 1. ディレクトリ構造の整備

`src/hooks` ディレクトリを作成し、feature ごとにサブディレクトリを切るか、フラットに配置します。今回は feature ベースで整理します。

```
src/
  hooks/
    auth/
      useSignup.ts
      useLogin.ts
      useVerificationProtection.ts
```

### 2. Custom Hooks の設計

#### `useSignup.ts`
- **責務・機能**:
    - フォーム状態管理 (email, password, username)
    - フォームバリデーション (`validateForm`)
    - API連携 (`signup` action)
    - エラー / ローディング状態のハンドリング
- **返り値**:
    - `formState`: ユーザー入力値
    - `errors`: バリデーション/APIエラー
    - `loading`: 通信中ステータス
    - `handlers`: `handleChange`, `handleBlur`, `handleSubmit`

#### `useLogin.ts`
- **責務・機能**:
    - フォーム状態管理
    - バリデーション
    - API連携 (`signInWithPassword`)
    - エラー / ローディング状態のハンドリング
- **返り値**:
    - `useSignup` と同様の構造

#### `useVerificationProtection.ts`
- **責務・機能**:
    - URLクエリパラメータチェック (`verified=true`)
    - リダイレクトロジック
- **返り値**:
    - `isAuthorized`: 真偽値 (オプショナル。主に副作用ベース)

## 手順 (Execution Steps)

### Phase 3.1: Specification Analysis & Test Design
現状の仕様をコードから正確に抽出し、それを元にテストケースを作成します。

1.  [x] **Analyze Specs** [/agent_fact_checker]: `src/app/(auth)/**/page.tsx` のコードを解析し、バリデーションロジック、分岐条件、エラーメッセージ定数をリストアップする。
2.  [x] **Test Case Update** [/agent_test_engineer]: 上記で特定した仕様に基づき、Input/Outputを網羅した詳細なテストケース（Checklist）を `docs/test/separate_view_logic_test_cases.md` (新規) に作成する。
3.  [x] **Baseline Capture** [/agent_architect]: 現在のUI（Signup, Login, Verified）のスクリーンショットを取得し、変更がないことを確認するための正解データとする。Verifiedはメーラー経由しないと遷移できない画面なので作業完了後にユーザーに依頼する。

### Phase 3.2: Hook Foundation
1.  [x] [/agent_builder] `src/hooks/auth/` ディレクトリ作成。

### Phase 3.3: Signup Refactoring
1.  [x] **Create Hook** [/agent_builder]: `src/hooks/auth/useSignup.ts` を作成し、`signup/page.tsx` からロジックを移設。
2.  [x] **Refactor View** [/agent_builder]: `src/app/(auth)/signup/page.tsx` を修正し、Hook を利用する形に変更。
3.  [x] **Verify** [/agent_qa_master]: Phase 3.1 で更新された `docs/test/separate_view_logic_test_cases.md` の "Behavioral Regression (Signup Logic)" および "Visual Regression" テストを実行し、すべての合格基準を満たすことを確認する。

### Phase 3.4: Login Refactoring
1.  [x] **Create Hook**: `.agent/skills/agent_builder/SKILL.md` を一言一句読み直し、agent_builder の定義に従って `src/hooks/auth/useLogin.ts` を作成し、`login/page.tsx` からロジックを移設。
2.  [x] **Refactor View**: `.agent/skills/agent_builder/SKILL.md` を一言一句読み直し、agent_builder の定義に従って `src/app/(auth)/login/page.tsx` を修正し、Hook を利用する形に変更。
3.  [x] **Verify**: `.agent/skills/agent_qa_master/SKILL.md` を一言一句読み直し、agent_qa_master の定義に従って Phase 3.1 で更新された `docs/test/separate_view_logic_test_cases.md` の "Behavioral Regression (Login Logic)" および "Visual Regression" テストを実行し、すべての合格基準を満たすことを確認する。

### Phase 3.5: Verification Page Refactoring
1.  [ ] **Create Hook**: `.agent/skills/agent_builder/SKILL.md` を一言一句読み直し、agent_builder の定義に従って `src/hooks/auth/useVerificationProtection.ts` を作成。
2.  [ ] **Refactor View**: `.agent/skills/agent_builder/SKILL.md` を一言一句読み直し、agent_builder の定義に従って `src/app/(auth)/verified/page.tsx` を修正。
3.  [ ] **Verify**: `.agent/skills/agent_qa_master/SKILL.md` を一言一句読み直し、agent_qa_master の定義に従って Phase 3.1 で更新された `docs/test/separate_view_logic_test_cases.md` の "Verified Page Logic" および "Visual Regression" テストを実行し、すべての合格基準を満たすことを確認する。

## Verification Plan

### Manual Verification
リファクタリング前後で挙動が変わらないこと（回帰テスト）を確認します。

1.  [ ] **Regression Testing**: `.agent/skills/agent_qa_master/SKILL.md` を一言一句読み直し、agent_qa_master の定義に従って `docs/test/separate_view_logic_test_cases.md` の全シナリオを再実行。
2.  [ ] **UI Integrity**: `.agent/skills/agent_qa_master/SKILL.md` を一言一句読み直し、agent_qa_master の定義に従って Phase 3.1 で取得した Baseline と現在の画面を比較し、ピクセルパーフェクト（または意図した通りの維持）であることを確認。
