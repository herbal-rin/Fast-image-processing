# 安装和启动说明

## 环境要求

在运行此项目之前，请确保您的系统已安装以下软件：

### 1. Node.js
- 版本要求：Node.js 16.0 或更高版本
- 下载地址：https://nodejs.org/

### 2. 包管理器（选择其一）
- **pnpm**（推荐）：`npm install -g pnpm`
- **yarn**：`npm install -g yarn`
- **npm**：随Node.js一起安装

## 安装步骤

1. 打开终端，进入项目目录：
   ```bash
   cd /Users/herbal/code/src/image-editor
   ```

2. 安装项目依赖：
   ```bash
   # 使用 pnpm（推荐）
   pnpm install
   
   # 或使用 npm
   npm install
   
   # 或使用 yarn
   yarn install
   ```

3. 启动开发服务器：
   ```bash
   # 使用 pnpm
   pnpm dev
   
   # 或使用 npm
   npm run dev
   
   # 或使用 yarn
   yarn dev
   ```

4. 在浏览器中打开 `http://localhost:5173` 查看应用

## 构建生产版本

```bash
# 使用 pnpm
pnpm build

# 或使用 npm
npm run build

# 或使用 yarn
yarn build
```

## 预览生产版本

```bash
# 使用 pnpm
pnpm preview

# 或使用 npm
npm run preview

# 或使用 yarn
yarn preview
```

## 故障排除

### 如果遇到依赖安装问题：
1. 删除 `node_modules` 文件夹和 `package-lock.json`（如果存在）
2. 重新运行安装命令

### 如果遇到端口冲突：
- 开发服务器默认使用端口 5173
- 如果端口被占用，Vite会自动选择下一个可用端口

### 如果遇到构建错误：
1. 检查Node.js版本是否符合要求
2. 确保所有依赖都已正确安装
3. 查看终端错误信息进行调试

## 项目特性

✅ **已完成的功能**：
- 图像导入（点击按钮 + 拖拽）
- 基础调整（亮度、对比度、饱和度）
- 滤镜效果（灰度、反相、模糊、锐化）
- 变换操作（旋转、翻转）
- 裁剪功能（矩形选择）
- 撤销/重做功能
- 导出功能（PNG/JPEG）
- 视图模式切换
- 键盘快捷键支持

✅ **技术实现**：
- React + TypeScript + Vite
- Tailwind CSS 样式
- HTML5 Canvas 图像处理
- 模块化滤镜系统
- 历史记录管理
- 响应式UI设计

项目已完全实现所有要求的功能，可以直接运行使用！
