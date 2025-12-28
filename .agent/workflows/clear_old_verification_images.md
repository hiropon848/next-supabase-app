---
description: 指定した時間（デフォルト24h）以上経過した現在のプロジェクトの検証用画像を削除する
---

このワークフローは、ディスク容量を節約するために、現在のプロジェクト用の `browser_recordings` フォルダ内にある、指定時間以上経過した画像ファイルを削除します。
引数で「時間（hour）」を指定できます。指定がない場合は24時間が適用されます。
対象ディレクトリ: `/Users/hiroakihashiba/.gemini/antigravity/browser_recordings/c73b7075-2871-4109-b656-64144aeffc50/`

1. プロジェクト固有のディレクトリから、指定時間（デフォルト24時間）以上更新されていない画像ファイルを検索し、削除します。
// turbo
```bash
HOURS=${1:-24}
# Pythonを使って浮動小数点（0.5など）を分（整数）に確実に変換
MINUTES=$(python3 -c "print(int(float('${HOURS}') * 60))")

echo "${HOURS}時間（${MINUTES}分）以上経過した画像を検索して削除します..."

count=$(find /Users/hiroakihashiba/.gemini/antigravity/browser_recordings/c73b7075-2871-4109-b656-64144aeffc50/ -type f -name "*.jpg" -mmin +$MINUTES -print -delete | wc -l)
echo "削除されたファイル数: $count"
```

2. 完了メッセージを表示します。
古い画像データの削除が完了しました。
