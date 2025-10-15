# Steam成就展示系统

这个系统可以从Steam API获取游戏成就数据，并在Hugo博客中展示，每个成就都可以点击跳转到Steam页面。

## 功能特性

- 🎯 **可点击链接**: 每个成就都可以点击跳转到Steam页面
- 🎨 **美观展示**: 支持成就图标、描述和隐藏成就标识
- 📱 **响应式设计**: 在移动设备上也能完美显示
- 🛠️ **易于使用**: 通过Hugo短代码轻松在文章中展示
- 🔧 **本地同步**: 支持手动运行脚本同步成就数据

## 安装配置

### 1. 获取Steam API密钥

1. 访问 [Steam Web API Key页面](https://steamcommunity.com/dev/apikey)
2. 登录您的Steam账户
3. 输入域名（可以是您的博客域名）
4. 获取API密钥

### 2. 设置环境变量

在您的本地环境中设置Steam API密钥：

**macOS/Linux:**
```bash
export STEAM_API_KEY="your_api_key_here"
```

**Windows:**
```cmd
set STEAM_API_KEY=your_api_key_here
```

或者创建 `.env` 文件：
```
STEAM_API_KEY=your_api_key_here
```

### 3. 获取游戏App ID

您可以在Steam商店页面URL中找到App ID，例如：
`https://store.steampowered.com/app/2052410/` 中的 `2052410`

查看常用游戏ID：
```bash
python scripts/steam_achievements.py --list-games
```

## 使用方法

### 在文章中展示所有成就

#### 方法一：使用默认数据文件

```markdown
{{< steam_achievements >}}
```

#### 方法二：指定具体的数据文件（推荐）

```markdown
{{< steam_achievements_from_file file="data/steam_achievements_2052410_mahoutsukai_no_yoru.json" >}}
```

### 展示单个成就

#### 方法一：使用默认数据文件

```markdown
{{< steam_achievement name="achievement_name" >}}
```

#### 方法二：指定具体的数据文件（推荐）

```markdown
{{< steam_achievement name="TROPHY_1" file="data/steam_achievements_2052410_mahoutsukai_no_yoru.json" >}}
```

### 手动同步成就数据

#### 方法一：使用Python脚本（推荐）

1. 确保已设置环境变量（见上面的配置步骤）

2. 安装Python依赖：
   ```bash
   pip install -r requirements.txt
   ```

3. 运行同步脚本：
   ```bash
   # 基本用法
   python scripts/steam_achievements.py 2052410
   
   # 自定义输出文件
   python scripts/steam_achievements.py 2052410 -o data/my_game.json
   
   # 查看帮助
   python scripts/steam_achievements.py --help
   
   # 列出常用游戏ID
   python scripts/steam_achievements.py --list-games
   ```

#### 方法二：使用Bash脚本

```bash
# 基本用法
./scripts/sync_achievements.sh 2052410

# 自定义输出文件
./scripts/sync_achievements.sh 2052410 data/my_game.json
```

#### 脚本会自动：
- 从Steam API获取游戏信息和成就数据
- 自动识别游戏名称（无需手动输入）
- 根据游戏名称和App ID自动生成唯一的文件名，避免覆盖
- 支持多个游戏同时存在不同的数据文件中

#### 文件命名规则：
- 格式：`data/steam_achievements_{AppID}_{游戏名称}.json`
- 示例：`data/steam_achievements_2052410_project_w.json`
- 特殊字符会被自动替换为下划线

#### 重要提示：
- Hugo会自动加载`data/`目录下的所有JSON文件
- 在短代码中使用完整路径：`data/steam_achievements_2052410_project_w.json`
- Hugo会自动根据文件名（去掉扩展名）来访问数据

## 文件结构

```
├── scripts/
│   └── steam_achievements.py          # Steam API数据获取脚本
├── data/
│   └── steam_achievements.json        # 成就数据文件
├── layouts/
│   └── shortcodes/
│       ├── steam_achievements.html    # 所有成就展示短代码
│       └── steam_achievement.html     # 单个成就展示短代码
└── requirements.txt                   # Python依赖
```

## 自定义样式

### 主题切换支持

Steam成就展示组件完全支持深色/浅色主题切换：

- ✅ **自动检测**：支持 `prefers-color-scheme` 媒体查询
- ✅ **类名切换**：支持 `.theme-dark` 和 `.theme-light` 类名方式
- ✅ **CSS变量**：使用CSS自定义属性，便于主题定制
- ✅ **平滑过渡**：所有颜色变化都有平滑的过渡效果

### 自定义颜色变量

您可以通过覆盖以下CSS变量来自定义颜色：

```css
.steam-achievements-container {
    --bg-primary: white;           /* 主要背景色 */
    --bg-secondary: #f8f9fa;       /* 次要背景色 */
    --bg-tertiary: #f0f0f0;        /* 第三背景色 */
    --text-primary: #171a21;       /* 主要文字颜色 */
    --text-secondary: #8f98a0;     /* 次要文字颜色 */
    --border-color: #e1e5e9;       /* 边框颜色 */
    --border-light: #d6d9dc;       /* 浅色边框 */
    --border-secondary: #c0c0c0;   /* 次要边框 */
    --accent-color: #1b2838;       /* 强调色 */
    --link-color: #66c0f4;         /* 链接颜色 */
    --link-hover: #4a9fd1;         /* 链接悬停色 */
    --shadow-color: rgba(0,0,0,0.1); /* 阴影颜色 */
}
```

### 其他自定义选项

- 修改 `.steam-achievements-container` 来改变整体容器样式
- 修改 `.achievement-card` 来改变单个成就卡片样式
- 修改 `.steam-button` 来改变Steam链接按钮样式

## 故障排除

### 常见问题

1. **成就数据无法加载**
   - 检查 `data/steam_achievements.json` 文件是否存在
   - 确认Steam API密钥是否正确设置
   - 尝试手动运行同步脚本

2. **图片无法显示**
   - Steam成就图标URL可能会变化，脚本会自动使用灰色图标作为备用
   - 检查网络连接是否正常

3. **脚本执行失败**
   - 确认STEAM_API_KEY环境变量是否正确设置
   - 检查Python脚本是否有语法错误
   - 查看终端输出获取详细错误信息

### 调试模式

在Python脚本中添加调试信息：

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 扩展功能

### 添加更多游戏

1. 修改 `scripts/steam_achievements.py`
2. 为不同游戏创建不同的数据文件
3. 创建对应的短代码文件

### 添加用户成就状态

如果需要显示用户的成就解锁状态，可以：

1. 使用Steam API的 `GetPlayerAchievements` 接口
2. 需要用户的Steam ID
3. 修改数据结构和展示逻辑

## 许可证

此项目基于MIT许可证开源。请确保遵守Steam的使用条款和API使用政策。

## 贡献

欢迎提交Issue和Pull Request来改进这个系统！
