# 多游戏Steam成就管理系统

## 🎯 解决的问题

1. **数据覆盖问题**：之前不同游戏的成就数据会相互覆盖
2. **单个成就显示问题**：单个成就短代码无法正确显示
3. **多游戏管理**：现在支持同时管理多个游戏的成就数据

## 🆕 新功能特性

### 1. 自动文件命名
- 脚本会根据游戏名称和App ID自动生成唯一文件名
- 格式：`data/steam_achievements_{AppID}_{游戏名称}.json`
- 特殊字符自动替换为下划线，确保文件名安全

### 2. 多数据文件支持
- 每个游戏的数据存储在独立的JSON文件中
- 支持同时展示多个游戏的成就
- 避免数据覆盖问题

### 3. 灵活的短代码
- `steam_achievements`：使用默认数据文件
- `steam_achievements_from_file`：指定具体数据文件（推荐）
- `steam_achievement`：显示单个成就，支持指定文件

## 📝 使用方法

### 同步不同游戏的成就

```bash
# 同步魔法师之夜
python scripts/steam_achievements.py 2052410
# 生成文件：data/steam_achievements_2052410_mahoutsukai_no_yoru.json

# 同步Portal
python scripts/steam_achievements.py 400
# 生成文件：data/steam_achievements_400_portal.json

# 同步其他游戏
python scripts/steam_achievements.py 2273000
# 生成文件：data/steam_achievements_2273000_mahoutsukai_no_yoru_chinese.json
```

### 在文章中使用

#### 展示所有成就（推荐方式）

```markdown
# 魔法师之夜成就
{{< steam_achievements_from_file file="data/steam_achievements_2052410_mahoutsukai_no_yoru.json" >}}

# Portal成就
{{< steam_achievements_from_file file="data/steam_achievements_400_portal.json" >}}
```

#### 展示单个成就

```markdown
# 魔法师之夜的第一个成就
{{< steam_achievement name="TROPHY_1" file="data/steam_achievements_2052410_mahoutsukai_no_yoru.json" >}}

# Portal的第一个成就
{{< steam_achievement name="PORTAL_GET_PORTALGUNS" file="data/steam_achievements_400_portal.json" >}}
```

## 📁 文件结构示例

```
data/
├── steam_achievements_2052410_mahoutsukai_no_yoru.json      # 魔法师之夜
├── steam_achievements_400_portal.json                       # Portal
├── steam_achievements_2273000_mahoutsukai_no_yoru_chinese.json  # 魔法师之夜中文版
└── steam_achievements_1244460_the_legend_of_heroes.json     # 轨迹4
```

## 🔧 高级用法

### 自定义输出文件名

```bash
# 自定义文件名
python scripts/steam_achievements.py 2052410 -o data/my_custom_name.json
```

### 批量同步多个游戏

```bash
# 创建批量同步脚本
#!/bin/bash
games=("2052410" "400" "2273000" "1244460")
for game in "${games[@]}"; do
    echo "同步游戏 $game..."
    python scripts/steam_achievements.py "$game"
    sleep 2  # 避免API请求过快
done
```

## 🎨 样式自定义

每个短代码都包含完整的CSS样式，您可以：

1. 修改短代码文件中的CSS样式
2. 在主题的CSS文件中覆盖样式
3. 使用CSS变量来统一控制颜色和尺寸

## ⚠️ 注意事项

1. **API密钥**：确保设置了有效的Steam API密钥
2. **文件路径**：在短代码中使用完整的文件路径
3. **成就名称**：确保成就名称与JSON文件中的完全匹配
4. **网络连接**：同步需要稳定的网络连接

## 🚀 最佳实践

1. **使用具体文件名**：推荐使用 `steam_achievements_from_file` 短代码
2. **定期同步**：设置定时任务定期更新成就数据
3. **备份数据**：定期备份 `data/` 目录下的JSON文件
4. **错误处理**：检查短代码是否正确显示，如有问题查看浏览器控制台

## 📊 性能优化

1. **图片懒加载**：成就图标会自动处理加载失败的情况
2. **响应式设计**：在不同设备上都能良好显示
3. **缓存机制**：Hugo会缓存数据文件，提高构建速度
