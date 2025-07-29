# 時 - Edge浏览器主页扩展

一个优雅、现代且功能丰富的浏览器主页扩展，专为Microsoft Edge浏览器设计，提供全新的标签页体验。

## 🌟 功能特性

### 核心功能
- **📅 日历模块** - 精美日历视图，支持倒计时事件管理
- **🔖 书签管理** - 可视化书签管理，支持文件夹分类和拖拽排序
- **✅ 待办事项** - 智能待办清单，支持提醒通知功能
- **📝 笔记功能** - 快速记录灵感，支持富文本编辑
- **💭 每日一言** - 精选励志语录，每日更新
- **📰 新闻资讯** - 实时新闻推送，保持信息同步

### 特色模式
- **🧘 禅模式 (Zen Mode)** - 极简专注界面，减少干扰
- **🎭 幕帘模式 (Curtain Mode)** - 沉浸式浏览体验

### 个性化定制
- **🎨 主题系统** - 支持明暗主题切换
- **⚙️ 高级设置** - 模块化配置，自定义功能开关
- **🔍 智能搜索** - 集成多搜索引擎支持
- **📱 响应式设计** - 完美适配各种屏幕尺寸

## 🚀 技术架构

### 技术栈
- **React 18** - 现代化前端框架
- **Styled Components** - CSS-in-JS样式解决方案
- **Material-UI** - Google设计系统组件
- **React Beautiful DnD** - 流畅的拖拽体验
- **Date-fns** - 轻量级日期处理库

### 浏览器支持
- ✅ Microsoft Edge (推荐)
- ✅ Google Chrome
- ✅ 其他Chromium内核浏览器

## 📦 安装指南


### 方式：开发者模式安装
1. 克隆或下载本项目
2. 运行 `npm install` 安装依赖
3. 运行 `npm run build:extension` 构建扩展
4. 打开Edge浏览器 → 扩展 → 开发者模式 → 加载已解压的扩展
5. 选择 `build/extension` 文件夹

## 🛠️ 开发指南

### 环境要求
- Node.js 16.0+
- npm 7.0+

### 开发环境搭建
```bash
# 克隆项目
git clone [项目地址]

# 进入项目目录
cd Edge-Homepage

# 安装依赖
npm install

# 启动开发服务器
npm start

# 构建扩展
npm run build:extension
```

### 项目结构
```
Edge-Homepage/
├── public/                 # 静态资源
│   ├── index.html         # 主页HTML
│   ├── manifest.json      # 扩展清单文件
│   └── icons/            # 图标资源
├── src/                   # 源代码
│   ├── components/        # 通用组件
│   ├── modules/          # 功能模块
│   │   ├── Bookmark/     # 书签模块
│   │   ├── Calendar/     # 日历模块
│   │   ├── Todo/        # 待办模块
│   │   ├── Note/        # 笔记模块
│   │   ├── Quote/       # 一言模块
│   │   └── News/        # 新闻模块
│   ├── modes/           # 特殊模式
│   │   ├── ZenMode/     # 禅模式
│   │   └── CurtainMode/ # 幕帘模式
│   ├── contexts/        # React上下文
│   ├── settings/        # 设置面板
│   ├── styles/          # 样式文件
│   └── utils/           # 工具函数
├── build/               # 构建输出
├── extension/           # 扩展构建输出
└── scripts/             # 构建脚本
```

## 🎯 使用说明

### 基本操作
1. **模块切换**：点击顶部导航栏切换不同功能模块
2. **添加内容**：点击右下角的"+"按钮添加新项目
3. **编辑删除**：悬停在项目上显示编辑和删除按钮
4. **拖拽排序**：在书签模块中可拖拽调整顺序

### 高级功能
- **禅模式**：点击头部菜单进入专注模式
- **主题切换**：在设置中切换明暗主题
- **数据导出**：支持书签和待办事项的导入导出
- **快捷键**：支持键盘快捷键操作

### 数据管理
- 所有数据保存在浏览器本地存储
- 支持数据备份和恢复
- 隐私保护：所有数据仅保存在本地

## 🎨 自定义配置

### 主题设置
- 自动跟随系统主题
- 手动切换明暗模式
- 自定义强调色

### 模块配置
- 启用/禁用特定模块
- 调整模块显示顺序
- 设置默认启动模块

### 搜索配置
- 自定义搜索引擎
- 设置搜索建议
- 配置搜索快捷键

## 🔧 API接口

### 本地存储API
- `getFromStorage(key, defaultValue)` - 获取本地存储数据
- `saveToStorage(key, value)` - 保存数据到本地存储

### URL处理工具
- `handleUrlChange(url)` - 标准化URL格式
- `urlHandler` - URL验证和处理工具

## 🐛 故障排除

### 常见问题

**Q: 扩展安装后没有生效**
A: 检查Edge浏览器是否允许扩展覆盖新标签页，在扩展设置中启用"允许访问文件网址"

**Q: 数据丢失**
A: 检查浏览器隐私设置，确保没有启用"关闭浏览器时清除数据"

**Q: 通知不工作**
A: 检查系统通知权限，确保Edge浏览器有通知权限

### 调试模式
1. 打开Edge扩展管理页面
2. 找到"時"扩展，点击"背景页"
3. 查看控制台日志获取调试信息

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

### 贡献流程
1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 开发规范
- 使用ESLint代码规范
- 提交前运行测试
- 保持代码注释完整
- 遵循项目代码风格

## 🙏 致谢

- 感谢 [Material-UI](https://mui.com/) 提供优秀的UI组件
- 感谢 [React Beautiful DnD](https://github.com/atlassian/react-beautiful-dnd) 提供流畅的拖拽体验
- 感谢所有贡献者和用户

## 📞 联系方式

- **项目主页**: [GitHub Repository](https://github.com/your-username/Edge-Homepage)
- **问题反馈**: [提交Issue](https://github.com/your-username/Edge-Homepage/issues)
- **功能建议**: [提交Feature Request](https://github.com/your-username/Edge-Homepage/issues)

---

**時** - 让每一次打开新标签页都成为美好的开始 ✨
