#!/usr/bin/env python3
"""
Steam成就数据获取脚本
用于自动同步Steam游戏的成就信息到Hugo博客
支持通过命令行参数指定游戏App ID
"""

import requests
import json
import os
import argparse
import sys
from datetime import datetime
import time

class SteamAchievements:
    def __init__(self, api_key, app_id):
        self.api_key = api_key
        self.app_id = app_id
        self.base_url = "https://api.steampowered.com"
        
    def get_game_info(self):
        """获取游戏基本信息"""
        url = f"{self.base_url}/ISteamUserStats/GetSchemaForGame/v2/"
        params = {
            'key': self.api_key,
            'appid': self.app_id
        }
        
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            if 'game' in data:
                game_data = data['game']
                return {
                    'name': game_data.get('gameName', 'Unknown Game'),
                    'version': game_data.get('gameVersion', ''),
                    'availableGameStats': game_data.get('availableGameStats', {})
                }
            else:
                print("未找到游戏数据")
                return None
                
        except requests.exceptions.RequestException as e:
            print(f"获取游戏信息失败: {e}")
            return None

    def get_game_schema(self):
        """获取游戏成就架构信息"""
        game_info = self.get_game_info()
        if game_info and 'achievements' in game_info['availableGameStats']:
            return game_info['availableGameStats']['achievements'], game_info
        else:
            print("未找到成就数据")
            return [], None
    
    def format_achievement_data(self, achievements):
        """格式化成就数据"""
        formatted_achievements = []
        
        for achievement in achievements:
            formatted_achievement = {
                'name': achievement.get('name', ''),
                'displayName': achievement.get('displayName', ''),
                'description': achievement.get('description', ''),
                'icon': achievement.get('icon', ''),
                'icongray': achievement.get('icongray', ''),
                'hidden': achievement.get('hidden', 0),
                'steamUrl': f"https://steamcommunity.com/stats/{self.app_id}/achievements/"
            }
            
            # 构建Steam成就页面的具体链接
            achievement_name = achievement.get('name', '')
            if achievement_name:
                # Steam成就页面通常使用成就名称作为锚点
                formatted_achievement['steamUrl'] += f"#{achievement_name}"
            
            formatted_achievements.append(formatted_achievement)
        
        return formatted_achievements
    
    def save_to_json(self, achievements, output_path, game_info):
        """保存成就数据到JSON文件"""
        data = {
            'lastUpdated': datetime.now().isoformat(),
            'gameInfo': {
                'appId': self.app_id,
                'name': game_info.get('name', 'Unknown Game'),
                'version': game_info.get('version', ''),
                'totalAchievements': len(achievements)
            },
            'achievements': achievements
        }
        
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"成就数据已保存到: {output_path}")
        print(f"游戏: {game_info.get('name', 'Unknown Game')} (App ID: {self.app_id})")
        print(f"共获取到 {len(achievements)} 个成就")

def validate_app_id(app_id):
    """验证App ID格式"""
    try:
        int(app_id)
        return True
    except ValueError:
        return False

def generate_safe_filename(game_name, app_id):
    """生成安全的文件名"""
    import re
    
    # 移除特殊字符，只保留字母数字和连字符
    safe_name = re.sub(r'[^\w\s-]', '', game_name)
    safe_name = re.sub(r'[-\s]+', '_', safe_name)
    safe_name = safe_name.lower()
    
    # 限制长度
    if len(safe_name) > 50:
        safe_name = safe_name[:50]
    
    return f"data/steam_achievements_{app_id}_{safe_name}.json"

def main():
    parser = argparse.ArgumentParser(
        description='Steam成就数据同步脚本',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  python steam_achievements.py 2052410                    # 魔法师之夜
  python steam_achievements.py 2273000                    # 魔法师之夜(中文版)
  python steam_achievements.py 2052410 -o data/my_game.json  # 自定义输出文件
  python steam_achievements.py 2052410 --list-games       # 列出常用游戏ID

常用游戏App ID:
  2052410  - Mahoutsukai no Yoru (魔法师之夜)
  2273000  - Mahoutsukai no Yoru (Chinese) (魔法师之夜 中文版)
  1244460  - The Legend of Heroes: Trails of Cold Steel IV
  991980   - The Legend of Heroes: Trails of Cold Steel III
        """
    )
    
    parser.add_argument('app_id', 
                       nargs='?',
                       help='Steam游戏App ID (使用 --list-games 时可选)')
    parser.add_argument('-o', '--output', 
                       default=None,
                       help='输出文件路径 (默认: 根据游戏名称自动生成)')
    parser.add_argument('--list-games', 
                       action='store_true',
                       help='列出常用游戏App ID')
    
    args = parser.parse_args()
    
    # 列出常用游戏
    if args.list_games:
        print("常用Steam游戏App ID:")
        print("  2052410  - Mahoutsukai no Yoru (魔法师之夜)")
        print("  1244460  - The Legend of Heroes: Trails of Cold Steel IV")
        print("  991980   - The Legend of Heroes: Trails of Cold Steel III")
        print("  814380   - Sekiro: Shadows Die Twice")
        print("  1244460  - The Legend of Heroes: Trails of Cold Steel IV")
        print("\n更多游戏ID可以在Steam商店页面URL中找到")
        print("例如: https://store.steampowered.com/app/2052410/ 中的 2052410")
        return
    
    # 检查是否提供了app_id
    if not args.app_id:
        print("错误: 请提供Steam游戏App ID")
        print("使用方法: python steam_achievements.py <APP_ID>")
        print("查看帮助: python steam_achievements.py --help")
        print("列出常用游戏: python steam_achievements.py --list-games")
        sys.exit(1)
    
    # 验证App ID
    if not validate_app_id(args.app_id):
        print(f"错误: '{args.app_id}' 不是有效的App ID")
        print("App ID应该是纯数字，例如: 2052410")
        sys.exit(1)
    
    # 获取API密钥
    STEAM_API_KEY = os.getenv('STEAM_API_KEY')
    if not STEAM_API_KEY:
        print("错误: 请设置 STEAM_API_KEY 环境变量")
        print("获取方法: https://steamcommunity.com/dev/apikey")
        print("\n设置方法:")
        print("  export STEAM_API_KEY='your_api_key_here'")
        sys.exit(1)
    
    # 创建Steam成就获取器
    steam_achievements = SteamAchievements(STEAM_API_KEY, args.app_id)
    
    print(f"正在获取游戏 App ID {args.app_id} 的成就数据...")
    
    # 获取成就数据
    achievements, game_info = steam_achievements.get_game_schema()
    
    if achievements and game_info:
        # 格式化数据
        formatted_achievements = steam_achievements.format_achievement_data(achievements)
        
        # 确定输出文件路径
        if args.output:
            output_path = args.output
        else:
            output_path = generate_safe_filename(game_info.get('name', 'Unknown'), args.app_id)
        
        # 保存到JSON文件
        steam_achievements.save_to_json(formatted_achievements, output_path, game_info)
        
        print("\n✅ 成就数据同步完成!")
        print(f"📁 数据文件: {output_path}")
        print(f"🎮 游戏名称: {game_info.get('name', 'Unknown Game')}")
        print(f"🏆 成就数量: {len(formatted_achievements)}")
    else:
        print("❌ 未能获取到成就数据")
        print("可能的原因:")
        print("  1. App ID不正确")
        print("  2. 游戏没有成就系统")
        print("  3. API密钥无效")
        print("  4. 网络连接问题")
        sys.exit(1)

if __name__ == "__main__":
    main()
