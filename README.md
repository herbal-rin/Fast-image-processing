# 图像处理编辑器

一个基于 React + TypeScript + Vite 的前端图像处理小程序，提供直观的图像编辑功能。

## 🚀 快速开始

### 方式一：一键启动（推荐）

```bash
# 克隆项目
git clone <your-repo-url>
cd image-editor

# 一键启动
./start.sh
```

### 方式二：Docker运行

```bash
# 克隆项目
git clone <your-repo-url>
cd image-editor

# 一键部署
./deploy.sh

# 或者手动Docker命令
docker-compose up -d
```

访问：http://localhost:3000

### 方式三：本地运行

```bash
# 克隆项目
git clone <your-repo-url>
cd image-editor

# 安装依赖
pnpm install  # 或 npm install

# 启动开发服务器
pnpm dev      # 或 npm run dev
```

访问：http://localhost:5173

## 📦 部署选项

### Docker部署
```bash
# 构建并运行
pnpm run docker:build
pnpm run docker:run

# 或使用docker-compose
pnpm run docker:up
```

### 在线部署
- **Vercel**: 连接GitHub仓库，自动部署
- **Netlify**: 连接GitHub仓库，设置构建命令 `pnpm build`
- **GitHub Pages**: 使用GitHub Actions自动部署

## 🛠️ 开发命令

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 构建生产版本
pnpm preview      # 预览生产版本
pnpm deploy       # 一键Docker部署
```

## 📋 功能特性

- ✅ 图像导入（点击按钮 + 拖拽）
- ✅ 基础调整（亮度、对比度、饱和度）
- ✅ 滤镜效果（灰度、反相、模糊、锐化）
- ✅ 变换操作（旋转、翻转）
- ✅ 裁剪功能（矩形选择）
- ✅ 撤销/重做功能
- ✅ 导出功能（PNG/JPEG）
- ✅ 视图模式切换
- ✅ 键盘快捷键支持

## 🔧 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite
- **样式框架**：Tailwind CSS
- **图像处理**：HTML5 Canvas
- **包管理器**：pnpm

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
