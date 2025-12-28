# パスワード表示切り替え機能 (修正版)

## 目的

ユーザーの指示に従い、`lucide-react` ではなく `react-icons` を使用してパスワード表示切り替え機能を再実装します。

## ユーザーレビュー事項

- `lucide-react` から `react-icons` へのライブラリ変更。
- アイコンセットは `react-icons/md` (Material Design) の `MdVisibility`, `MdVisibilityOff` を使用します。

## 変更内容案

### `package.json`

- **変更なし**: `lucide-react` は `shadcn/ui` 等の他コンポーネントで利用されている可能性があるため、アンインストールは行いません。

### `src/app/login/page.tsx`

- **インポート変更**: `lucide-react` からの `Eye`, `EyeOff` インポートを削除し、`react-icons/md` から `MdVisibility`, `MdVisibilityOff` をインポートします。
- **コンポーネント置換**:
  - `<Eye size={20} />` -> `<MdVisibility size={20} />`
  - `<EyeOff size={20} />` -> `<MdVisibilityOff size={20} />`

## 検証計画

### 手動検証

1. ログインページを開く。
2. **重要**: パスワード欄が空の状態でも、右側に目のアイコンが**常に表示されている**ことを確認する。
3. デフォルトでパスワード入力が伏せ字（`type="password"`）であることを確認する。
4. アイコンをクリックする。
5. パスワードが表示（`type="text"`）され、アイコンが「非表示」用（斜線付きなど）に切り替わることを確認する。
6. もう一度クリックして元に戻ることを確認する。
