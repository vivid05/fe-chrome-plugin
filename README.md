# Timo工具箱 - Chrome扩展插件

一个功能丰富的Chrome浏览器扩展插件，为开发者和普通用户提供AI问答、多语言翻译、图片处理和各种开发工具。

## 主要功能

### AI智能助手
- **AI问答**: 基于SiliconFlow AI API的智能对话
- **流式回复**: 实时打字机效果，支持emoji表情
- **智能降级**: API失败时自动切换到备用服务
- **对话记录**: 完整的聊天历史保存

### 多语言翻译
- **AI翻译**: 使用SiliconFlow AI提供高质量翻译
- **9种语言**: 支持中文、英文、阿拉伯语、葡萄牙语、印尼语、土耳其语、菲律宾语、马来语、西班牙语
- **实时翻译**: 输入即翻译，支持语言自动检测
- **加载效果**: 优雅的翻译进度提示

### 图片处理工具
- **图片压缩**: 高效的图片文件大小压缩
- **图片编辑**: 基础的图片编辑功能
- **格式转换**: 多种图片格式支持

### 开发工具
- **API测试**: PostMan风格的API接口测试工具
- **Base64编解码**: 文本和图片的Base64转换
- **颜色工具**: 颜色代码转换和调色板
- **正则表达式**: 正则测试和验证工具

## 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm 或 pnpm
- Chrome浏览器

### 安装依赖
```bash
npm install
# 或者
pnpm install
```

### 开发模式
```bash
npm run dev
# 或者
pnpm dev
```

### 构建生产版本
```bash
npm run build
# 或者
pnpm build
```

### 安装Chrome插件
1. 构建完成后，打开Chrome浏览器
2. 进入 `chrome://extensions/`
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目的 `dist` 目录

## 配置说明

### AI功能配置
在使用AI相关功能前，需要配置API Token：

1. **复制环境变量文件**：
   ```bash
   cp .env.example .env
   ```

2. **编辑 `.env` 文件**：
   ```bash
   # SiliconFlow AI API配置
   VITE_AI_API_TOKEN=your-actual-siliconflow-api-token
   ```

### 获取API Token
1. 访问 [SiliconFlow官网](https://cloud.siliconflow.cn/)
2. 注册账号并获取API Token
3. 将Token替换到 `.env` 文件中

### 安全注意事项
- ⚠️ **重要**：`.env` 文件包含敏感信息，已被 `.gitignore` 排除，不会提交到版本控制
- 🔒 请妥善保管您的API Token，不要在公开场合泄露
- 📝 可以参考 `.env.example` 文件了解配置格式

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **HTTP客户端**: Axios
- **AI服务**: SiliconFlow API / OpenAI SDK
- **样式预处理**: Less
- **代码规范**: ESLint + Prettier
- **提交规范**: Commitizen + Commitlint

## 核心特性

### AI功能优势
- 双重保障：AI优先 + 传统API备用
- 流式响应：实时显示回复内容
- 表情支持：智能添加emoji表情
- 多语言：支持9种主流语言翻译

### 用户体验
- 响应式设计：适配不同屏幕尺寸
- 加载动效：优雅的loading效果
- 错误处理：完善的异常处理机制
- 快捷操作：键盘快捷键支持

## 开发指南

### 规范化提交
```bash
npm run commit
```

### 代码格式化
```bash
npm run prettier
```

### 代码检查
```bash
npm run eslint
```

## 贡献指南

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 开源协议

本项目采用 MIT 协议 - 查看 [LICENSE](LICENSE) 文件了解详情

## 相关链接

- [SiliconFlow API文档](https://docs.siliconflow.cn/)
- [Chrome扩展开发文档](https://developer.chrome.com/docs/extensions/)
- [Vue 3 官方文档](https://v3.vuejs.org/)

## 联系方式

如有问题或建议：
- 提交 [Issue](../../issues)
- 创建 [Pull Request](../../pulls)

---

**如果这个项目对你有帮助，请给个Star支持一下！**