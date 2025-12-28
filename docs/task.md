# Glass Liquid UI エッジ歪み実装

[Zennの記事](https://zenn.dev/siino/articles/b660f78461bbf4)の手法に基づき、ログインカードの端に静的かつ有機的なレンズのような歪みを加える高忠実度のエフェクトを実装します。

## タスク

- [x] **調査と計画**
    - [x] リファレンス動画の特徴を分析
    - [x] 有機的な液状歪みのための[Zennの記事](https://zenn.dev/siino/articles/b660f78461bbf4)を深掘り
    - [x] 実装計画の更新 [implementation_plan.md]
- [x] **実装**
    - [x] **Step 1: SVGフィルターの定義** (`src/app/login/page.tsx`)
        - 記事に従い `feTurbulence` (低周波), `feGaussianBlur`, `feComposite`, `feDisplacementMap` を実装。
    - [x] **Step 2: 歪みレイヤーの適用**
        - `backdrop-filter: url(#...)` を使用。
        - エフェクトを端のみに制限（中央はクリアに保つ）するために `mask-image: radial-gradient(...)` を適用。
    - [x] **Step 3: 検証フェーズ 1: 視覚的な忠実度の確認**
        - [x] 歪みエフェクトがリファレンスと一致することを確認
        - [x] ベースのぼかしの一貫性を確認
        - [x] インタラクティブ要素（入力欄）がクリック可能であることを検証
        - [x] **検証済み**: 歪みは強力 (-70)、中央はクリア、エッジはシャープ。
- [x] 機能実装: パスワード表示切り替え
    - [x] パスワード可視化のための状態管理を追加
    - [x] リファクタリング: `lucide-react` から `react-icons/md` (`MdVisibility`, `MdVisibilityOff`) へ切り替え
    - [x] 常時表示（空の場合も含む）と機能性の検証
    - [x] 不透明度の調整 (50% -> 70%)
- [x] 最終調整: ウォークスルーとドキュメント
    - [x] スクリーンショット付きの walkthrough.md を作成
    - [x] ウォークスルーを日本語に翻訳
    - [x] 目次を追加
    - [x] アクセシビリティと検索向上のためドキュメントをプロジェクトルート (`docs/`) に移動
- [x] 開発環境整備: 検証画像お掃除
    - [x] カスタムワークフローの作成 (`/clear_old_verification_images`)
    - [x] 安全装置（拡張子フィルタ）の確認と引数（時間指定）対応
- [x] UI/UX 改善
    - [x] Create account ボタンの影削除 (`shadow-none`)
    - [x] 入力欄、ボタンの角丸調整 (`rounded-full`, `rounded-lg`)
    - [x] ラベルフォントの太さ調整 (`font-semibold`)
    - [x] 説明文の左揃え (`text-left`)
- [x] ソース管理
    - [x] GitHub リポジトリへのプッシュ
