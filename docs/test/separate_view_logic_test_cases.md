# View/Logic Separation Refactoring - Test Cases

リファクタリングによる挙動の変化がないこと（回帰テスト）を保証するためのテストケース一覧です。
各フェーズの検証 (`Verify`) 時にこれらのテストを実行してください。

> [!NOTE]
> **Test Account:** `Email: kabukimono.sanjo+3@gmail.com`, `Pass: Test1234`


## 1. Static Analysis (Specification Check)

コード解析により抽出された既存仕様です。
リファクタリング後のコード（Custom Hook および View）がこれらの仕様を維持しているか確認してください。

### Signup (`useSignup` + `signup/page.tsx`)

- [x] **Email Validation**
    - [x] 必須チェック: 空文字の場合、「メールアドレスを入力してください」等のエラーが表示されること。
    - [x] 形式チェック: `/\S+@\S+\.\S+/` に一致しない場合、「有効なメールアドレスを入力してください」が表示されること。
- [x] **Password Validation**
    - [x] 必須チェック: 空文字の場合、「パスワードを入力してください」等のエラーが表示されること。
    - [x] 長さチェック: 6文字未満の場合、「パスワードは6文字以上で入力してください」が表示されること。
- [x] **API Error Handling**
    - [x] 登録済みエラー: サーバーから "User already registered" が返った場合、「すでに登録されているメールアドレスです。」と表示されること。
    - [x] レート制限エラー: "Rate limit exceeded" の場合、「不正な大量アクセスが発生しています。」が表示されること。
    - [x] その他のエラー: エラー発生時に汎用的なエラーメッセージ（例: 「登録中にエラーが発生しました」）が表示されること。
- [x] **Success Flow**
    - [x] 成功時: `alert` で「確認メールを送信しました...」が表示され、OKを押すと `/login` に遷移すること。
- [x] **Loading State**
    - [x] 送信中: ボタンのラベルが「登録中...」になり、無効化（disabled）されること。

### Login (`useLogin` + `login/page.tsx`)

- [x] **Email/Password Validation**
    - [x] Signupと同様の必須・形式・長さチェックが機能すること。
- [x] **API Error Handling**
    - [x] 認証エラー: "Invalid login credentials" の場合、「無効なメールアドレスまたはパスワードです。」と表示されること。
    - [x] 未確認エラー: "Email not confirmed" の場合、「メール認証が完了していません。受信したメールから認証をおこなってください。」が表示されること。
    - [x] その他のエラー: エラー発生時に汎用的なエラーメッセージ（例: 「ログイン中にエラーが発生しました」）が表示されること。
- [x] **Success Flow**
    - [x] 成功時: 前述の「Test Account」を用いてログインし、`/main` へリダイレクトされること。
- [x] **Loading State**
    - [x] 送信中: ボタンのラベルが「ログイン中...」になり、無効化されること。

### Verified Page (`useVerificationProtection` + `verified/page.tsx`)

- [ ] **Access Protection (不正アクセスのガード)**
    - [ ] **手順A: パラメータなしアクセス**
        - ブラウザで `http://localhost:3000/verified` にアクセスする。
        - **確認事項1 (Redirect)**: 最終的なURLが `/login` になっていること。（※現在 `/signup` に飛ぶバグあり。要修正）
        - **確認事項2 (No Flash)**: ロード中、一瞬でも「認証完了」等の画面が表示されず、完全に非表示 (`return null`) のまま遷移すること。
    - [ ] **手順B: 無効なパラメータアクセス**
        - ブラウザで `http://localhost:3000/verified?verified=false` や `?foo=bar` にアクセスする。
        - **確認事項**: 手順Aと同様に、`/signup` にリダイレクトされること。
- [ ] **Display (正規アクセスの表示)**
    - [ ] **手順: 正規アクセス**
        - ブラウザで `http://localhost:3000/verified?verified=true` にアクセスする。
        - **確認事項**: リダイレクトされず、以下の要素が表示されること。
            - タイトル: 「認証完了」
            - 説明文: 「認証が完了しました。ログイン画面からログインしてください。」
            - ボタン: 「ログイン画面へ」

## 2. Behavioral Regression Test (Manual Operation)

実際にブラウザを操作して行う確認事項です。

### Scenario 1: Signup Flow
- [x] `/signup` にアクセスする。
- [x] 不正なメールアドレス（例: `test`）を入力し、フォーカスを外す（または送信する）。エラーが表示されるか確認。
- [x] 6文字未満のパスワードを入力し、エラーが表示されるか確認。
- [x] 正常な値を入力し、登録ボタンを押下。
- [x] 「登録中...」の表示を確認。
- [x] 完了アラートが表示され、承認後に `/login` へ遷移することを確認。

### Scenario 2: Login Flow
- [x] `/login` にアクセスする。
- [x] 登録されていない（または誤った）情報を入力して送信。「メールアドレスまたは...」のエラー確認。
- [x] 前述の「Test Account」を用いてログインし、/main へ遷移することを確認。
- [x] 「ログイン中...」の表示を確認。


### Scenario 3: Verified Page Assurance
- [ ] クエリパラメータなしで `/verified` に直接アクセスする -> `/login` に飛ばされること。
- [ ] `/verified?verified=true` にアクセスする -> ページが正しく表示されること。

## 3. Visual Regression Test

`docs/screenshots/baseline_*.png` と比較し、レイアウト崩れがないか確認します。
検証担当者（QA Master）は、以下のスクリーンショットと現状を比較してください。

- [x] **Signup Page**: 入力フォーム、ボタン、リンクの配置。
- [x] **Login Page**: 同上。
- [ ] **Verified Page**: メッセージの配置。
- [ ] **Error States**: バリデーションエラー表示時のレイアウト（ズレていないか）。
