# Supabase Auth 実装計画 (Supabase SSR + Next.js App Router)

## 概要

Supabase SSRパッケージ (`@supabase/ssr`) を使用し、Cookieベースの堅牢な認証フローを実装します。
サーバーアクション (Server Actions) を活用し、クライアントサイドJSを最小限に抑えます。
ユーザー体験（UI/UX）の検証を優先するため、バックエンドの仮実装（スケルトン）→UI実装→ロジック実装の順に進めます。

## User Prerequisites (User Tasks)

実装を開始する前に、以下のタスクをユーザー様ご自身で完了させる必要があります。

### 1. Supabase Project Setup

- [x] **Create Project**: Supabaseダッシュボードで新規プロジェクトを作成する。
- [x] **Get Keys**: Project Settings > API から `Project URL` と `anon public key` を取得する。

### 2. Environment Variables

- [x] **Create .env.local**: プロジェクトルートに `.env.local` を作成し、以下を設定する。
  ```bash
  NEXT_PUBLIC_SUPABASE_URL=your-project-url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  ```

### 3. Dashboard Configuration

- [x] **Auth Providers**: Authentication > Providers で `Email` が有効であることを確認。
- [x] **Site URL**: Authentication > URL Configuration > Site URL を `http://localhost:3000` に設定。
- [x] **Redirect URLs**: 同画面で `http://localhost:3000/auth/callback` を追加。

## Implementation Phases

### Phase 1: Skeleton Setup (Prerequisite for UI)

UI実装を先行させるため、依存関係にあるバックエンドファイルの「型定義」と「空関数」のみを先に作成します。
これにより、UI構築時のビルドエラーを防ぎます。

- [x] **Create Actions Skeleton**: `src/app/auth/actions.ts` を作成し、空の `login`, `signup`, `logout` 関数をexportする。
- [x] **Create Client Skeleton**: `src/lib/supabase/server.ts` を作成し、空の `createServerClient` をexportする。
- [x] **Objective**: 実装の中身は空で良い。UI側からimportしてもエラーにならない状態を作ることが目的。

### Phase 2: UI Integration (Shared Layout)

- [x] **Auth Layout**: `src/app/(auth)/layout.tsx` を作成。
  - [x] 既存の `src/app/login/layout.tsx` のGlass Liquid UIロジックをここに移動・共通化する。
  - [x] LoginとSignupで同じ背景エフェクトを共有させる。
- [x] **Refactor Login Page**: `src/app/login/page.tsx` を `src/app/(auth)/login/page.tsx` に移動・リファクタリング。
- [x] **Create Signup Page**: `src/app/(auth)/signup/page.tsx` を作成（Loginページのコンポーネントを再利用し、同様のデザインで実装済み）。

### Phase 3: Database & Logic Implementation

#### 3.0 Completed Foundations
- [x] **Data Access Layer (DAL)**: `src/data/auth.ts` を作成。
  - Supabaseクライアントを直接操作し、DB(Auth)へのCRUDのみを担当する関数群を実装。
- [x] **Service Layer**: `src/services/auth.ts` を作成。
  - DALを呼び出し、バリデーションやビジネスロジック（入力整形、エラーハンドリング）を担当。
- [x] **Supabase Server Client**: `src/lib/supabase/server.ts` にCookie制御ロジックを実装。
- [x] **Middleware**: `middleware.ts` でセッションのリフレッシュ処理を実装。

#### 3.1 Database Schema Setup
- [x] **Create Profiles Table**: `public.profiles` テーブルを作成 (id, username, updated_at, created_at)。
- [x] **Create Trigger Function**: `auth.users` 作成時に自動実行される `handle_new_user` 関数を作成。
- [x] **Create Trigger**: `auth.users` への INSERT をトリガーにする設定。

#### 3.2 Remaining Logic Implementation
- [x] **Auth Actions**: `src/app/auth/actions.ts` を実装。
  - Service Layerのみを呼び出す（DALやSupabaseを直接呼ばない）。
- [x] **Callback Route**: `src/app/auth/callback/route.ts` を作成し、PKCEフローのコード交換処理を実装。


### Phase 4: Verification

- [x] **Scenario Test**:
  - [x] 新規登録処理がエラーなく完了すること。
  - [x] **Database Check**: `auth.users` にユーザーが作成されていること。
  - [x] **Database Check**: `public.profiles` にユーザー名が保存されていること。

## Verification Plan

### Automated Tests

なし（認証フローはブラウザ依存が強いためManual Verification中心）

### Manual Verification

1. **Sign Up**: 新規ユーザー登録を実施。
2. **DB Validation**: SupabaseのTable Editorにて以下の確認を行う。
   - `auth.users`: ユーザーが作成されているか。
   - `public.profiles`: 同じIDでレコードが作成され、`username` が保存されているか。

### Phase 5: Main Screen (メイン画面) & Session Management (Done)

#### [MODIFY] [src/app/main/page.tsx](file:///Users/hiroakihashiba/Documents/VibeCording/next-supabase-app/src/app/main/page.tsx)

- ログアウトボタンの実装。
- ユーザー情報の表示確認。

#### Verification (Session)
- [x] ログイン後のメイン画面表示確認。
- [x] ログアウト機能の動作確認。

### Phase 6: Production Readiness (Future Work)

#### [Test Design] (Role: Test Engineer)
- **Objective**: 手動検証による見落としと速度低下を防ぐため、再現可能なテスト手順を確立する。
- **Deliverable**: `docs/test/phase6_auth_flow.md` (テストケース)
- **Scope**:
    - メール確認フロー（Signup -> 完了画面確認 -> Verify Link踏む -> Login）
    - エラー時のUI確認（Invalid Token, Already Registered等）

#### Implementation Steps

1.  **Supabase Console**:
    - `Authentication` -> `Providers` -> `Email` -> `Confirm email` を **ON** に変更。
2.  **SMTP Provider**:
    - `Authentication` -> `Settings` -> `SMTP Settings` にて、商用SMTP（Resend, SendGrid, AWS SES等）を設定する。
    - **注意**: デフォルトのSupabase SMTPは、開発用かつ到達率が低いため、`Invalid email` エラーの原因となる公算が高い。
3.  **UI Update**:
    - `src/app/(auth)/signup/page.tsx` 内の完了メッセージアラート（99行目付近）のコメントアウトを解除する。
    - エラーハンドリング：「メール送信完了」と「実際の認証エラー」を適切に区別するUIへ改善する。
