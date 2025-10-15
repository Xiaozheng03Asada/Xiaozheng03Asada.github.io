# Steam成就展示 - 主题切换支持

## 🌓 主题切换功能

Steam成就展示组件已经完全支持深色/浅色主题切换，提供了多种兼容方式。

## 🎨 支持的切换方式

### 1. 系统偏好自动检测

组件会自动检测用户的系统主题偏好：

```css
/* 深色主题 */
@media (prefers-color-scheme: dark) {
    .steam-achievements-container {
        --bg-primary: #2d2d2d;
        --text-primary: #ffffff;
        /* ... 其他深色主题变量 */
    }
}

/* 浅色主题 */
@media (prefers-color-scheme: light) {
    .steam-achievements-container {
        --bg-primary: white;
        --text-primary: #171a21;
        /* ... 其他浅色主题变量 */
    }
}
```

### 2. CSS类名切换

支持通过CSS类名手动切换主题：

```css
/* 深色主题类 */
.theme-dark .steam-achievements-container {
    --bg-primary: #2d2d2d;
    --text-primary: #ffffff;
    /* ... 深色主题变量 */
}

/* 浅色主题类 */
.theme-light .steam-achievements-container {
    --bg-primary: white;
    --text-primary: #171a21;
    /* ... 浅色主题变量 */
}
```

## 🎯 颜色变量说明

### 主要颜色变量

| 变量名 | 浅色主题 | 深色主题 | 说明 |
|--------|----------|----------|------|
| `--bg-primary` | `white` | `#2d2d2d` | 主要背景色 |
| `--bg-secondary` | `#f8f9fa` | `#1a1a1a` | 次要背景色 |
| `--bg-tertiary` | `#f0f0f0` | `#1a1a1a` | 第三背景色 |
| `--text-primary` | `#171a21` | `#ffffff` | 主要文字颜色 |
| `--text-secondary` | `#8f98a0` | `#b0b0b0` | 次要文字颜色 |
| `--border-color` | `#e1e5e9` | `#333` | 边框颜色 |
| `--border-light` | `#d6d9dc` | `#444` | 浅色边框 |
| `--border-secondary` | `#c0c0c0` | `#555` | 次要边框 |
| `--accent-color` | `#1b2838` | `#66c0f4` | 强调色 |
| `--link-color` | `#66c0f4` | `#66c0f4` | 链接颜色 |
| `--link-hover` | `#4a9fd1` | `#4a9fd1` | 链接悬停色 |
| `--shadow-color` | `rgba(0,0,0,0.1)` | `rgba(255,255,255,0.1)` | 阴影颜色 |

## 🔧 自定义主题

### 方法一：覆盖CSS变量

在您的主题CSS文件中添加：

```css
/* 自定义深色主题 */
@media (prefers-color-scheme: dark) {
    .steam-achievements-container {
        --bg-primary: #1e1e1e;        /* 自定义深色背景 */
        --text-primary: #e0e0e0;      /* 自定义深色文字 */
        --accent-color: #00d4aa;      /* 自定义强调色 */
    }
}

/* 自定义浅色主题 */
@media (prefers-color-scheme: light) {
    .steam-achievements-container {
        --bg-primary: #fafafa;        /* 自定义浅色背景 */
        --text-primary: #333333;      /* 自定义浅色文字 */
        --accent-color: #007acc;      /* 自定义强调色 */
    }
}
```

### 方法二：使用类名方式

如果您的主题使用类名切换，可以添加：

```css
/* 自定义深色主题类 */
.my-custom-dark .steam-achievements-container {
    --bg-primary: #1e1e1e;
    --text-primary: #e0e0e0;
    --accent-color: #00d4aa;
}

/* 自定义浅色主题类 */
.my-custom-light .steam-achievements-container {
    --bg-primary: #fafafa;
    --text-primary: #333333;
    --accent-color: #007acc;
}
```

## 🎨 主题效果预览

### 浅色主题
- 白色背景的成就卡片
- 深色文字，易于阅读
- 浅色边框和阴影
- Steam蓝色链接

### 深色主题
- 深灰色背景的成就卡片
- 白色文字，护眼舒适
- 深色边框和浅色阴影
- 保持Steam蓝色链接

## 🚀 最佳实践

1. **保持一致性**：确保成就展示的颜色与您的网站主题保持一致
2. **对比度**：确保文字与背景有足够的对比度，便于阅读
3. **可访问性**：遵循WCAG指南，确保颜色对比度符合标准
4. **测试**：在多种设备和浏览器上测试主题切换效果

## 🔍 调试技巧

### 检查CSS变量是否生效

在浏览器开发者工具中：

1. 选择成就展示元素
2. 在Computed标签页中查看CSS变量值
3. 确认变量值是否正确应用

### 测试主题切换

```javascript
// 手动切换主题进行测试
document.body.classList.toggle('theme-dark');
document.body.classList.toggle('theme-light');

// 或者通过媒体查询测试
window.matchMedia('(prefers-color-scheme: dark)').matches
```

## 📱 响应式支持

主题切换在所有设备尺寸下都能正常工作：

- ✅ 桌面端：完整功能
- ✅ 平板端：完整功能  
- ✅ 移动端：完整功能

## 🎯 兼容性

- ✅ Chrome 88+
- ✅ Firefox 87+
- ✅ Safari 14+
- ✅ Edge 88+

主题切换功能使用了现代CSS特性，在支持CSS自定义属性的浏览器中都能正常工作。
