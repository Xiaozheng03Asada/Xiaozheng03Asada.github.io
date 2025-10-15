#!/bin/bash

# Steam成就同步脚本
# 使用方法: ./sync_achievements.sh <APP_ID> [输出文件]

set -e

# 脚本目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 检查参数
if [ $# -eq 0 ]; then
    echo "用法: $0 <APP_ID> [输出文件]"
    echo ""
    echo "示例:"
    echo "  $0 2052410                           # 魔法师之夜"
    echo "  $0 2273000                           # 魔法师之夜(中文版)"
    echo "  $0 2052410 data/my_game.json         # 自定义输出文件"
    echo ""
    echo "查看常用游戏ID:"
    echo "  python $SCRIPT_DIR/steam_achievements.py --list-games"
    exit 1
fi

APP_ID="$1"
OUTPUT_FILE="${2:-data/steam_achievements.json}"

# 检查Python脚本是否存在
if [ ! -f "$SCRIPT_DIR/steam_achievements.py" ]; then
    echo "错误: 找不到 steam_achievements.py 脚本"
    exit 1
fi

# 检查环境变量
if [ -z "$STEAM_API_KEY" ]; then
    echo "错误: 请设置 STEAM_API_KEY 环境变量"
    echo "获取方法: https://steamcommunity.com/dev/apikey"
    echo ""
    echo "设置方法:"
    echo "  export STEAM_API_KEY='your_api_key_here'"
    exit 1
fi

# 切换到项目根目录
cd "$PROJECT_ROOT"

echo "🎮 开始同步Steam成就数据..."
echo "App ID: $APP_ID"
echo "输出文件: $OUTPUT_FILE"
echo ""

# 运行Python脚本
python "$SCRIPT_DIR/steam_achievements.py" "$APP_ID" -o "$OUTPUT_FILE"

echo ""
echo "🎉 同步完成！"
echo "💡 提示: 现在可以在Hugo文章中使用 {{< steam_achievements >}} 来展示成就"
