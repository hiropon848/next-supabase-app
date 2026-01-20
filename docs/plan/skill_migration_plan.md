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
  │   ├── agent_architect/     <-- 元ファイル名と完全一致
  │   │   └── SKILL.md         <-- 定義ファイル (固定名)
  │   ├── agent_builder/
  │   │   └── SKILL.md
  │   ├── util_force_reset_bias/  <-- 接頭辞も維持
  │   │   └── SKILL.md
  │   └── ...
  │
  └── workflows/               <-- ショートカット置き場として維持
```

## 3. 移行ステップ

### Step 1: フォルダ作成とファイルの移動 (Strict Name Match)

`.agent/workflows/` 内の既存ファイルを、**ファイル名（拡張子除く）と完全に一致するディレクトリ名** で `.agent/skills/` に移動し、`SKILL.md` にリネームします。
**重要: 接頭辞（agent_, util_）の省略や変更は一切行いません。**

#### 対象ファイルのマッピング

| 元のファイル (`.agent/workflows/`) | 新しいパス (`.agent/skills/`) | ディレクトリ名 (Skill名) |
| :--- | :--- | :--- |
| `agent_architect.md` | `agent_architect/SKILL.md` | `agent_architect` |
| `agent_builder.md` | `agent_builder/SKILL.md` | `agent_builder` |
| `agent_fact_checker.md` | `agent_fact_checker/SKILL.md` | `agent_fact_checker` |
| `agent_qa_master.md` | `agent_qa_master/SKILL.md` | `agent_qa_master` |
| `agent_requirement_guard.md` | `agent_requirement_guard/SKILL.md` | `agent_requirement_guard` |
| `agent_test_engineer.md` | `agent_test_engineer/SKILL.md` | `agent_test_engineer` |

**Utility Skills (機能)**

| 元ファイル (`.agent/workflows/`) | 新パス (`.agent/skills/...`) | スキルID (`name`) |
| :--- | :--- | :--- |
| `util_clear_old_verification...md` | `util_clear_old_verification_images/SKILL.md` | `util_clear_old_verification_images` |
| `util_create_commit_command.md` | `util_create_commit_command/SKILL.md` | `util_create_commit_command` |
| `util_force_reset_bias.md` | `util_force_reset_bias/SKILL.md` | `util_force_reset_bias` |
| `util_only_text_answer.md` | `util_only_text_answer/SKILL.md` | `util_only_text_answer` |
| `util_show_next_task.md` | `util_show_next_task/SKILL.md` | `util_show_next_task` |

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
name: agent_architect  # <- 元のファイル名と完全一致させる
description: 設計・仕様責任者として振る舞い、実装計画を策定するスキル
---

# Architect Agent Workflow
...
```

#### 具体例: util_create_commit_command の場合
```markdown
---
name: util_create_commit_command  # <- 元のファイル名と完全一致させる
description: プロジェクトの変更内容を確認し、適切なコミットコマンドを作成するスキル
---

# util_create_commit_command
...
```

### Step 3: プロジェクトルール (`docs/RULES.md`) の更新

`docs/RULES.md` の **「10. Agent Workflows」** セクションを、以下の要領で具体的に置換します。

#### 変更ターゲット 1: 10.1 Role Definition (パスの置換)
| ロール | 変更前 (Before) | 変更後 (After) |
| :--- | :--- | :--- |
| Requirement Guard | `.agent/workflows/agent_requirement_guard.md` | `.agent/skills/agent_requirement_guard/SKILL.md` |
| FactChecker | `.agent/workflows/agent_fact_checker.md` | `.agent/skills/agent_fact_checker/SKILL.md` |
| Architect | `.agent/workflows/agent_architect.md` | `.agent/skills/agent_architect/SKILL.md` |
| Test Engineer | `.agent/workflows/agent_test_engineer.md` | `.agent/skills/agent_test_engineer/SKILL.md` |
| Builder | `.agent/workflows/agent_builder.md` | `.agent/skills/agent_builder/SKILL.md` |
| QA Master | `.agent/workflows/agent_qa_master.md` | `.agent/skills/agent_qa_master/SKILL.md` |

#### 変更ターゲット 2: 10.2 & 10.3 Protocols (指示の置換)
| 対象箇所 | 変更前 (Before) | 変更後 (After) |
| :--- | :--- | :--- |
| Assignment Verification | `ワークフローファイル（.agent/workflows/ 以下）を read する` | `スキル定義ファイル（.agent/skills/*/SKILL.md）を read する` |
| Context Switch | `指定されたワークフローファイル（例: .agent/workflows/agent_test_engineer.md）の内容を参照・ロードする` | `指定されたスキル定義ファイル（例: .agent/skills/agent_test_engineer/SKILL.md）の内容を参照・ロードする` |

### Step 4: ショートカットWorkflowの作成

Util系コマンドを `/` (Slash Command) で呼び出せるようにするため、`.agent/workflows/` にショートカット用ファイルを作成します。

#### 作成ルール
- **ファイル名:** `cmd_[元のファイル名].md`
- **内容:** 対応するSkillを呼び出す指示のみを記述する（`// turbo` を付与して自動実行させる）。

#### 作成リスト
- `cmd_util_clear_old_verification_images.md`
- `cmd_util_create_commit_command.md`
- `cmd_util_force_reset_bias.md`
- `cmd_util_only_text_answer.md`
- `cmd_util_show_next_task.md`

### Step 5: クリーンアップ

1.  上記作業が完了したら、`.agent/workflows/` ディレクトリ内の「移行済みファイル」のみを削除します。
2.  **注意:** `.agent/workflows/` ディレクトリ自体は削除せず、Step 4で作成したショートカットファイルを保持します。

## 4. 運用ルール (Zero Maintenance)

- **Registry不要**: `skill_registry.json` や `README.md` による一覧管理は行いません。`.agent/skills/` のディレクトリ構成そのものを一覧として扱います。
- **新規追加時**: 新しいスキルが必要な場合は、`.agent/skills/` にフォルダを作成し、`SKILL.md` (YAML付き) を配置するだけで自動的に認識対象となります。
