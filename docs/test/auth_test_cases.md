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
