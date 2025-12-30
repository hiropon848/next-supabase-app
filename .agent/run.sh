#!/bin/bash
# .agent/run.sh

# 設定ファイルが存在すれば読み込む
if [ -f .agent/config.env ]; then
  set -a # 変数を自動エクスポート
  source .agent/config.env
  set +a
fi

# 引記数で渡されたコマンドを実行
exec "$@"
