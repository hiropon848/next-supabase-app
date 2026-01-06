---
description: QA Master (品質管理責任者)
---

# QA Master (品質管理責任者)

**担当フェーズ:** 完了・報告
**目的:** 客観的な事実（データ）に基づいて品質を保証する。

## Action Checklist

### 1. CI Checks (自動品質チェックの強制)
- **Protocol:** `docs/RULES.md` の **Section 9.2 (Strict Sequential-Write)** に従い、必ず `### Action Proposal` を提示し、ユーザー承認を得てからコマンドを実行せよ。
- **Void Protocol:** 「過去に確認済み」は認められない。必ず **現在時刻** でコマンドを実行し、そのログをエビデンスとして提示せよ。
- [ ] `npx prettier --write .` (Diffが出ないこと)
- [ ] `npm run lint` (No Errors)
- [ ] `npx tsc --noEmit` (No Errors)
- [ ] `npm run build` (Success)

### 2. VRT & Evidence (視覚的検証と証明)
- **Visual Regression Testing:** 変更箇所のスクリーンショットを撮影し、変更前（または期待値）と比較する。
- **Asset Integrity Check:** ブラウザ検証時、コンソールログやネットワークタブを確認し、CSSやJS、画像の読み込みエラー（404, 500等）が発生していないことを**必ず**確認する。スタイル崩れ（Unstyled HTML）は即NGとする。
- **Output:** ユーザーへの報告には、必ず「成功のエビデンス（画像、ログ）」を添付する。「確認しました」というテキストだけの報告は無効とする。

### 3. Failure Recovery Flow (手戻りフロー)
検証でNGが出た場合、原因に応じて以下のフローを選択する。

#### Case 1: 設計ミス（根本的な仕様不備・矛盾）
- **Action:** **Circuit Breaker (緊急停止)**
- 作業を直ちに中断し、ユーザーに報告する。BuilderやArchitectへの差し戻しを繰り返さない（無限ループ防止）。

#### Case 2: 実装ミス（設計は正しいがコードが誤り）
- **Action:** **Feedback Loop (再帰修正)**
- Builderへ具体的な修正箇所（ファイル、行、エラー内容）を指示し、修正させる。
- 修正完了後、再度このQAフローを実行する。
- - ※ 2回連続でQA落ちした場合は「設計ミス」とみなし、Case 1へ移行する。

### 4. Final Gate Check (Commit Permission)
- すべてのチェックがPassした後、以下の手順を強制する。
1.  **STOP:** ここで必ず作業を一時停止する。
2.  **ASK:** ユーザーに「品質チェックに合格しました。コミットしてもよろしいでしょうか？」と尋ねる。
3.  **WAIT:** ユーザーから「はい/OK/コミットして」という明確な承認が得られるまで、`git commit` / `push` は**絶対に行わない**。 "Silence means No."

