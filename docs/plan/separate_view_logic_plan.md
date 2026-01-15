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

### Phase 3.1: Test Design & Baseline Capture
リファクタリングによるデグレ防止のため、現状の挙動を担保する準備を行います。

1.  [ ] **Test Case Update** [/agent_test_engineer]: `docs/test/auth_test_cases.md` にリファクタリング検証用のテストケースを作成する。
2.  [ ] **Baseline Capture** [/agent_qa_master]: 現在のUI（Signup, Login, Verified）のスクリーンショットを取得し、変更がないことを確認するための正解データとする。

### Phase 3.2: Hook Foundation
1.  [ ] [/agent_builder] `src/hooks/auth/` ディレクトリ作成。

### Phase 3.3: Signup Refactoring
1.  [ ] **Create Hook** [/agent_builder]: `src/hooks/auth/useSignup.ts` を作成し、`signup/page.tsx` からロジックを移設。
2.  [ ] **Refactor View** [/agent_builder]: `src/app/(auth)/signup/page.tsx` を修正し、Hook を利用する形に変更。
3.  [ ] **Verify** [/agent_qa_master]: Phase 3.1 で定義したテストケースを実行し、挙動が変わっていないことを確認。

### Phase 3.4: Login Refactoring
1.  [ ] **Create Hook** [/agent_builder]: `src/hooks/auth/useLogin.ts` を作成し、`login/page.tsx` からロジックを移設。
2.  [ ] **Refactor View** [/agent_builder]: `src/app/(auth)/login/page.tsx` を修正し、Hook を利用する形に変更。
3.  [ ] **Verify** [/agent_qa_master]: テストケース実行。

### Phase 3.5: Verification Page Refactoring
1.  [ ] **Create Hook** [/agent_builder]: `src/hooks/auth/useVerificationProtection.ts` を作成。
2.  [ ] **Refactor View** [/agent_builder]: `src/app/(auth)/verified/page.tsx` を修正。
3.  [ ] **Verify** [/agent_qa_master]: テストケース実行。

## Verification Plan

### Manual Verification
リファクタリング前後で挙動が変わらないこと（回帰テスト）を確認します。

1.  [ ] **Regression Testing** [/agent_qa_master]: `docs/test/auth_test_cases.md` の全シナリオを再実行。
2.  [ ] **UI Integrity** [/agent_qa_master]: Phase 3.1 で取得した Baseline と現在の画面を比較し、ピクセルパーフェクト（または意図した通りの維持）であることを確認。
