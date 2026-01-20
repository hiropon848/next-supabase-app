---
name: util_clear_old_verification_images
description: 指定した時間（デフォルト24h）以上経過した現在のプロジェクトの検証用画像を削除する
---

このワークフローは、ディスク容量を節約するために、現在のプロジェクト用の `browser_recordings` フォルダ内にある、指定時間以上経過した画像ファイルを削除します。
引数で「時間（hour）」を指定できます。指定がない場合は24時間が適用されます。
対象ディレクトリ: `.agent/config.env` 内の `TARGET_MSG_DIR` で指定されたパス

1. プロジェクト固有のディレクトリから、指定時間（デフォルト24時間）以上更新されていない画像ファイルを検索し、削除します。
// turbo
```bash
HOURS=${1:-24}
# Pythonを使って浮動小数点（0.5など）を分（整数）に確実に変換
MINUTES=$(python3 -c "print(int(float('${HOURS}') * 60))")

# 設定読み込み（.agent/config.env）
[ -f .agent/config.env ] && source .agent/config.env

if [ -z "$TARGET_MSG_DIR" ]; then
  echo "Error: TARGET_MSG_DIR is not set in .agent/config.env"
  exit 1
fi

echo "${HOURS}時間（${MINUTES}分）以上経過した画像を検索して削除します..."
echo "対象ディレクトリ: $TARGET_MSG_DIR"

count=$(find "$TARGET_MSG_DIR" -type f -name "*.jpg" -mmin +$MINUTES -print -delete | wc -l)
echo "削除されたファイル数: $count"
```

2. 完了メッセージを表示します。
古い画像データの削除が完了しました。
