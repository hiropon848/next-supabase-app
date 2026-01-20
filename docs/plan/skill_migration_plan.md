# Antigravity Skills 導入手順書

本ドキュメントは、現在の `.agent/workflows/` ディレクトリ配下のファイルを、Antigravityの新機能「Skills」へ移行するための公式手順書です。

## 1. 目的
- **AI認識精度の向上**: ディレクトリ構造とYAMLメタデータにより、AIが各スキルの役割より正確に認識できるようにする。
- **拡張性の確保**: 将来的なスクリプト連携やテンプレート追加に対応できる標準構成とする。
- **運用コストの最小化**: 一覧ファイル（Registry等）を作成せず、ディレクトリ構造自体をインデックスとすることで二重管理を防ぐ。

## 2. ゴールとなるディレクトリ構成

`.agent/skills/` ディレクトリ直下に、各スキルごとのフォルダをフラットに配置します。

```text
.agent/
  ├── skills/                  <-- 新設 (スキル一覧のルート)
  │   ├── architect/           <-- 役割名・機能名 (ディレクトリ名)
  │   │   └── SKILL.md         <-- 定義ファイル (固定名)
  │   ├── builder/
  │   │   └── SKILL.md
  │   ├── force_reset_bias/    <-- ユーティリティも同様
  │   │   └── SKILL.md
  │   └── ...
  │
  └── workflows/               <-- 移行完了後に削除
```

## 3. 移行ステップ

### Step 1: フォルダ作成とファイルの移動 & リネーム

以下の対応表に従ってフォルダを作成し、既存のマークダウンファイルを移動して `SKILL.md` にリネームしてください。

**Role Skills (役割)**

| 元ファイル (`.agent/workflows/`) | 新パス (`.agent/skills/...`) | スキルID (`name`) |
| :--- | :--- | :--- |
| `agent_architect.md` | `architect/SKILL.md` | `architect` |
| `agent_builder.md` | `builder/SKILL.md` | `builder` |
| `agent_fact_checker.md` | `fact_checker/SKILL.md` | `fact_checker` |
| `agent_qa_master.md` | `qa_master/SKILL.md` | `qa_master` |
| `agent_requirement_guard.md` | `requirement_guard/SKILL.md` | `requirement_guard` |
| `agent_test_engineer.md` | `test_engineer/SKILL.md` | `test_engineer` |

**Utility Skills (機能)**

| 元ファイル (`.agent/workflows/`) | 新パス (`.agent/skills/...`) | スキルID (`name`) |
| :--- | :--- | :--- |
| `util_clear_old_verification...md` | `clear_old_verification_images/SKILL.md` | `clear_old_verification_images` |
| `util_create_commit_command.md` | `create_commit/SKILL.md` | `create_commit` |
| `util_force_reset_bias.md` | `force_reset_bias/SKILL.md` | `force_reset_bias` |
| `util_only_text_answer.md` | `only_text_answer/SKILL.md` | `only_text_answer` |
| `util_show_next_task.md` | `show_next_task/SKILL.md` | `show_next_task` |

### Step 2: YAML Frontmatter の追加 (必須)

移動した**すべての `SKILL.md` の先頭**に、YAML形式のメタデータを追加します。
既存の `---` ブロックがある場合は書き換え、なければ新規追加します。

#### 記述テンプレート
```markdown
---
name: [上記のスキルID]
description: [このスキルの役割や実行内容の簡潔な説明]
---

# (元のタイトル)
...
```

#### 具体例: Architect の場合
```markdown
---
name: architect
description: 設計・仕様責任者として振る舞い、実装計画を策定するスキル
---

# Architect Agent Workflow
...
```

#### 具体例: Create Commit の場合
```markdown
---
name: create_commit
description: プロジェクトの変更内容を確認し、適切なコミットコマンドを作成するスキル
---

# Create Commit Command
...
```

### Step 3: プロジェクトルール (`docs/RULES.md`) の更新

`docs/RULES.md` の **「10. Agent Workflows」** セクションを、以下の要領で具体的に置換します。

#### 変更ターゲット 1: 10.1 Role Definition (パスの置換)
| ロール | 変更前 (Before) | 変更後 (After) |
| :--- | :--- | :--- |
| Requirement Guard | `.agent/workflows/agent_requirement_guard.md` | `.agent/skills/requirement_guard/SKILL.md` |
| FactChecker | `.agent/workflows/agent_fact_checker.md` | `.agent/skills/fact_checker/SKILL.md` |
| Architect | `.agent/workflows/agent_architect.md` | `.agent/skills/architect/SKILL.md` |
| Test Engineer | `.agent/workflows/agent_test_engineer.md` | `.agent/skills/test_engineer/SKILL.md` |
| Builder | `.agent/workflows/agent_builder.md` | `.agent/skills/builder/SKILL.md` |
| QA Master | `.agent/workflows/agent_qa_master.md` | `.agent/skills/qa_master/SKILL.md` |

#### 変更ターゲット 2: 10.2 & 10.3 Protocols (指示の置換)
| 対象箇所 | 変更前 (Before) | 変更後 (After) |
| :--- | :--- | :--- |
| Assignment Verification | `ワークフローファイル（.agent/workflows/ 以下）を read する` | `スキル定義ファイル（.agent/skills/*/SKILL.md）を read する` |
| Context Switch | `指定されたワークフローファイル（例: .agent/workflows/agent_test_engineer.md）の内容を参照・ロードする` | `指定されたスキル定義ファイル（例: .agent/skills/test_engineer/SKILL.md）の内容を参照・ロードする` |

### Step 4: クリーンアップ

1.  上記作業が完了したら、`.agent/workflows/` ディレクトリの中身が空であることを確認します。
2.  `.agent/workflows/` ディレクトリ自体を削除します。

## 4. 運用ルール (Zero Maintenance)

- **Registry不要**: `skill_registry.json` や `README.md` による一覧管理は行いません。`.agent/skills/` のディレクトリ構成そのものを一覧として扱います。
- **新規追加時**: 新しいスキルが必要な場合は、`.agent/skills/` にフォルダを作成し、`SKILL.md` (YAML付き) を配置するだけで自動的に認識対象となります。
