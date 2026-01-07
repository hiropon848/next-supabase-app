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
- [x] **Create Signup Page**: `src/app/(auth)/signup/page.tsx` を作成（Loginページのコンポーネントを再利用）。

### Phase 3: Logic Implementation

- [ ] **Supabase Server Client**: `src/lib/supabase/server.ts` にCookie制御ロジックを実装。
- [ ] **Middleware**: `middleware.ts` でセッションのリフレッシュ処理を実装。
- [ ] **Auth Actions**: `src/app/auth/actions.ts` に実際のアクション（`signInWithPassword`, `signUp`）を実装。
- [ ] **Callback Route**: `src/app/auth/callback/route.ts` を作成し、PKCEフローのコード交換処理を実装。

### Phase 4: Verification

- [ ] **Scenario Test**:
  - [ ] 新規登録 -> ダッシュボードリダイレクト
  - [ ] ログアウト -> ログイン画面リダイレクト
  - [ ] 未ログインアクセス -> ログイン画面リダイレクト
- [ ] **UI Check**:
  - [ ] エラー時のトースト通知確認
  - [ ] ローディング状態のボタン表示確認は `/signup` への `Link` に変更。

#### [NEW] [src/app/(auth)/signup/page.tsx](<file:///Users/hiroakihashiba/Documents/VibeCording/next-supabase-app/src/app/(auth)/signup/page.tsx>)

- ログインページと同様のデザインで、サインアップ用フォームを実装。
- Server Action `signup` を呼び出す。
- 「ログイン」ボタンは `/login` への `Link` に設定。

### 3. Logic Implementation

UI確認完了後、中身の認証ロジックを実装します。

#### [NEW] [src/lib/supabase/server.ts](file:///Users/hiroakihashiba/Documents/VibeCording/next-supabase-app/src/lib/supabase/server.ts) (Implement)

- `createServerClient` の実装 (Cookieストア操作)。

#### [NEW] [src/lib/supabase/client.ts](file:///Users/hiroakihashiba/Documents/VibeCording/next-supabase-app/src/lib/supabase/client.ts)

- `createBrowserClient` の実装。

#### [NEW] [src/middleware.ts](file:///Users/hiroakihashiba/Documents/VibeCording/next-supabase-app/src/middleware.ts)

- `updateSession` 関数の実装 (Session Refresh)。

#### [NEW] [src/app/auth/actions.ts](file:///Users/hiroakihashiba/Documents/VibeCording/next-supabase-app/src/app/auth/actions.ts) (Implement)

- `login`, `signup`, `logout` への `supabase.auth` 呼び出し実装。

#### [NEW] [src/app/auth/callback/route.ts](file:///Users/hiroakihashiba/Documents/VibeCording/next-supabase-app/src/app/auth/callback/route.ts)

- コールバック処理の実装。

#### [MODIFY] [src/app/dashboard/page.tsx](file:///Users/hiroakihashiba/Documents/VibeCording/next-supabase-app/src/app/dashboard/page.tsx)

- ログアウトボタンの実装。
- ユーザー情報の表示確認。

## Verification Plan

### Automated Tests

なし（認証フローはブラウザ依存が強いためManual Verification中心）

### Manual Verification

1. **Sign Up**: 新規ユーザー登録を行い、Supabaseダッシュボードにユーザーが作成されるか確認。
2. **Login**: 登録したユーザーでログインでき、ダッシュボードへリダイレクトされるか確認。
3. **Session**: リロードしてもログイン状態が維持されるか確認 (Cookie)。
4. **Middleware**: ログインなしでダッシュボードにアクセスした場合、ログインページへリダイレクトされるか確認。
5. **Logout**: ログアウト後、ログインページへ戻り、Cookieが削除されるか確認。
