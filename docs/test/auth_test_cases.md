# Supabase Auth テストケース設計 (by Test Engineer)

## 概要

本ドキュメントは、Auth機能実装における各フェーズの「合格基準」を定義したものです。
QA Masterは本ドキュメントに基づき、Builderの成果物を検証してください。

---

## Phase 1: Skeleton Setup (Prerequisite for UI)

### [Test Case 1-1] Actions Skeleton の構造確認

- **目的:** UI実装時にimportエラーが発生しないことを保証する。
- **対象ファイル:** `src/app/auth/actions.ts`
- **検証手順 (QA Master向):**
  1. ファイルが存在するか確認する。
  2. 以下の関数が `export` されているか確認する（`grep`推奨）。
     - `login`
     - `signup`
     - `logout`
  3. 各関数が `FormData` を受け取るシグネチャ（または互換性）を持っているか確認する。
- **合格基準:**
  - ファイルが存在する。
  - 3つの関数が定義・エクスポートされている。

### [Test Case 1-2] Client Skeleton の構造確認

- **目的:** Server Componentsから呼び出し可能なクライアント作成関数を用意する。
- **対象ファイル:** `src/lib/supabase/server.ts`
- **検証手順 (QA Master向):**
  1. ファイルが存在するか確認する。
  2. `createServerClient` という関数が `export` されているか確認する。
- **合格基準:**
  - ファイルが存在する。
  - 指定された関数がエクスポートされている。

### [Test Case 1-3] 静的解析パス確認

- **目的:** 構文エラーや型エラーがない状態であること。
- **検証手順:**
  - `npx prettier --check .` を実行する。
  - `npm run lint` を実行する。
  - `npx tsc --noEmit` を実行する。
  - `npm run build` を実行する。
- **合格基準:**
  - エラーが出力されずにコマンドが終了すること。

---

## Phase 2: UI Integration (Shared Layout & Signup)

### [Test Case 2-1] Shared Layout Abstraction
- **目的:** 共通の「Glass Liquid Theme」ロジックがレイアウトコンポーネントとして分離され、再利用可能になっていること。
- **対象ファイル:** `src/app/(auth)/layout.tsx` (新規作成)
- **検証手順:**
    1.  `src/app/login/page.tsx` から `<svg>` フィルタ定義が削除されていることを確認する。
    2.  `src/app/(auth)/layout.tsx` に `<svg>` フィルタ定義が存在することを確認する。
    3.  ブラウザで `/login` を開き、背景エフェクト（歪み・ガラス感）が崩れていないか目視確認する。
- **合格基準:**
    - `page.tsx` のコード量が削減されていること。
    - `/login` の見た目が Phase 1 完了時と同じであること（回帰テスト）。

### [Test Case 2-2] Signup Page UI
- **目的:** 新規登録画面がログイン画面と同様のデザインテーマで実装されていること。
- **対象ファイル:** `src/app/signup/page.tsx`
- **検証手順:**
    1.  ブラウザで `/signup` にアクセスする。
    2.  フォーム要素（Email, Password）が存在することを確認する。
    3.  「アカウント作成」ボタンが存在することを確認する。
    4.  フッターに「すでにアカウントをお持ちの方はこちら（ログイン）」へのリンクがあるか確認する。
    5.  リンクをクリックし、 `/login` に遷移できるか確認する。
- **合格基準:**
    - ログイン画面と同じ Glass Liquid デザインが適用されていること。
    - 相互リンクにより `/login` <-> `/signup` 間を移動できること。

### [Test Case 2-3] 静的解析パス確認
- **目的:** 追加実装後のコードが品質基準（Format, Lint, Build）を満たしていること。
- **検証手順:**
  - `npx prettier --check .`
  - `npm run lint`
  - `npx tsc --noEmit`
  - `npm run build`
- **合格基準:**
  - エラーが出力されずにコマンドが終了すること。

### [Test Case 2-4] Layout Integrity Check
- **目的:** レスポンシブ対応および背景画像の表示が、UIデザインの最低基準（崩れていないこと）を満たしていること。
- **検証手順:**
    1.  ブラウザ開発者ツール等でウィンドウサイズを変更し、カードや背景が極端に崩れないか確認する。
    2.  背景画像が画面全体を覆っているか（`background-size: cover` 相当）、または意図したテクスチャが表示されているか確認する。
    3.  **注意:** 意図しない画像（例: ランダムなプレースホルダー画像、アニメ画像、サイズが合っていない画像など）が表示されていないこと。
    4.  テキスト（見出し、ラベル、ボタン文字）が背景に対して十分なコントラストを持ち、可読性が確保されていること。
- **合格基準:**
    - 画面リサイズ時にレイアウト破綻がないこと。
    - 背景画像がデザイン意図（Glass Liquid）に沿ったものであること。
    - 全てのテキストが明瞭に読み取れること。

---

## Phase 6: Production Readiness (Confirm Email Flow)
- **目的:** メール認証機能（Confirm Email: ON）が正しく動作し、未認証ユーザーのログインを阻止できること。
- **前提:**
    - Supabase Auth設定で `Confirm email` が有効化されていること。
    - ローカル環境では Inbucket (http://localhost:54323) を使用してメール受信を確認する。
- **対象ファイル:** `src/app/(auth)/signup/page.tsx`, `src/app/auth/callback/route.ts`
- **検証手順:**
    1.  **新規登録 (Signup):**
        - `/signup` から新規メールアドレスで登録を行う。
        - 画面に「確認メールを送信しました」等のメッセージが表示されることを確認。
        - **DB確認**: `auth.users` の `email_confirmed_at` が `NULL` であること。
    2.  **ログイン制限 (Login Block):**
        - メール認証前に `/login` から同ユーザーでログインを試行。
        - エラー（"Email not confirmed" 等）が表示され、ログインできないことを確認。
    3.  **メール受信 (Inbucket):**
        - http://localhost:54323/project/default/auth/templates を開き、認証メールが届いているか確認。
        - リンク（`Confirmation URL`）を確認。
    4.  **認証完了 (Verify):**
        - メール内のリンクをクリックする（またはURLをブラウザに貼り付け）。
        - `/main` (ダッシュボード) へリダイレクトされることを確認。
        - **DB確認**: `email_confirmed_at` に日時が記録されていること。
    5.  **再ログイン (Re-login):**
        - 一度ログアウトし、再度ログインできることを確認。
- **合格基準:**
    - 未認証状態でログインできないこと。
    - 認証リンク踏破後にログイン可能になること。
    - DBのステータスが適切に遷移すること。
