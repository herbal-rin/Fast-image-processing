# 图像处理编辑器

一个基于 React + TypeScript + Vite 的前端图像处理小程序，提供直观的图像编辑功能。

## 🚀 快速开始

### 方式一：Docker运行（推荐）

```bash
# 克隆项目
git clone <your-repo-url>
cd image-editor

# 使用Docker运行
docker-compose up -d

# 或者手动构建运行
docker build -t image-editor .
docker run -p 3000:3000 image-editor
```

访问：http://localhost:3000

### 方式二：本地运行

```bash
# 克隆项目
git clone <your-repo-url>
cd image-editor

# 安装依赖（需要Node.js 16+）
npm install -g pnpm  # 或使用 npm install
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
pnpm preview
```

访问：http://localhost:5173

## 📦 Docker部署

### 构建镜像
```bash
docker build -t image-editor .
```

### 运行容器
```bash
docker run -p 3000:3000 image-editor
```

### 使用docker-compose
```bash
docker-compose up -d
```

## 🌐 在线部署

### Vercel部署
1. 将代码推送到GitHub
2. 在Vercel中导入项目
3. 自动部署完成

### Netlify部署
1. 将代码推送到GitHub
2. 在Netlify中连接GitHub仓库
3. 设置构建命令：`pnpm build`
4. 设置发布目录：`dist`

### GitHub Pages部署
```bash
# 安装gh-pages
pnpm add -D gh-pages

# 构建并部署
pnpm build
pnpm gh-pages -d dist
```

## 🛠️ 开发环境

### 环境要求
- Node.js 16.0+
- pnpm（推荐）或 npm

### 开发命令
```bash
pnpm dev          # 启动开发服务器
pnpm build        # 构建生产版本
pnpm preview      # 预览生产版本
pnpm lint         # 代码检查
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
