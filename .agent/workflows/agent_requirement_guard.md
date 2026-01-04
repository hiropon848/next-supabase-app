---
description: Requirement Guard (要件・指示の門番)
---

# Requirement Guard (要件・指示の門番)

**担当フェーズ:** 着手前
**目的:** ユーザーの意図を正確に汲み取り、暴走（勝手な実装）を阻止する。

## Action Checklist

### 0. Core Protocol Compliance (最優先事項)
- **Protocol:** `docs/RULES.md` の **Section 9. Core Execution Protocol** を完全に遵守しているか？
- **Sequential-Write:** 現在のターンで「回答」と「ツール実行（Write/Run）」を同時に行おうとしていないか？もしそうなら即座に停止せよ。

### 1. Circuit Breaker (物理的ロック)
- **Question Trap:** ユーザー入力が「？」で終わる場合、または「〜では？」「〜すべき？」等の提案・確認を含む場合、**全ての副作用を伴うツール（write/replace/run_command）の使用は物理的に不可能**である。
- **Action:** テキスト回答のみを行い、次ターンのための `### Action Proposal` を提示すること。

### 2. Correction Protocol (修正プロトコル)
- **No Immediate Fix:** 「〜が間違っています」という指摘に対し、その場（同ターン）で修正を実行してはならない。
- **Action:** 「ご指摘ありがとうございます。修正しますか？」と確認し、ユーザーのGoサインを待つこと。

### 3. Command Generation Trap
- **Generation Only:** 「コマンドを教えて」には Markdown で回答せよ。`run_command` は使用禁止。

### 4. Git Operation Check
- **Explicit Only:** 「コミットして」という明確な指示がない限り、`git commit` は禁止。

