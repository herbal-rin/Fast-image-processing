# 🎨 图像处理编辑器

一个功能强大的前端图像处理应用，基于 React + TypeScript + Vite 构建，提供专业级的图像编辑和处理功能。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Vite](https://img.shields.io/badge/Vite-5.4-purple)

## ✨ 功能特性

### 🖼️ 基础图像操作
- ✅ **图像导入**：支持点击按钮和拖拽导入（PNG/JPEG/GIF/WebP）
- ✅ **图像导出**：导出为 PNG 或 JPEG 格式
- ✅ **视图模式**：适配、1:1、填充三种显示模式
- ✅ **对比模式**：原图、处理后、并排对比三种查看模式
- ✅ **撤销/重做**：完整的历史记录管理
- ✅ **一键重置**：快速恢复到原始状态

### 🎨 基础调整
- ✅ **亮度调节**：-100% 到 +100%
- ✅ **对比度调节**：-100% 到 +100%
- ✅ **饱和度调节**：-100% 到 +100%
- ✅ **RGB 通道独立调节**：精确控制每个颜色通道

### 🔧 滤镜效果
- ✅ **基础滤镜**：灰度、反相
- ✅ **模糊滤镜**：0-10px 可调模糊
- ✅ **锐化滤镜**：0-100% 强度可调
- ✅ **直方图均衡**：
  - 亮度模式：基于灰度的全局均衡
  - RGB 模式：独立通道均衡
  - 强度可调：0-100%

### 🔬 高级图像处理算法

#### 平滑算子（去噪）
- ✅ **中值滤波**：去除椒盐噪声，半径 0-3px
- ✅ **高斯模糊**：平滑图像，标准差 0-3σ

#### 锐化算子（增强边缘）
- ✅ **Laplacian 锐化**：二阶微分边缘增强

#### 边缘检测算子
- ✅ **Sobel 边缘检测**：梯度算子，应用最广泛
- ✅ **Prewitt 边缘检测**：简化梯度算子
- ✅ **Roberts 边缘检测**：对角线差分算子

### 🔄 几何变换
- ✅ **旋转**：90°、180°、270° 旋转
- ✅ **翻转**：水平翻转、垂直翻转
- ✅ **裁剪**：交互式矩形裁剪

### 📊 数据可视化
- ✅ **直方图显示**：RGB 三通道 + 灰度直方图
- ✅ **实时更新**：随图像处理实时更新

### ⌨️ 用户体验
- ✅ **滑块键盘输入**：支持直接输入数值精确调节
- ✅ **键盘快捷键**：
  - `Ctrl/Cmd + Z`：撤销
  - `Ctrl/Cmd + Shift + Z`：重做
  - `Ctrl/Cmd + S`：导出
  - `Ctrl/Cmd + R`：重置
  - `Esc`：取消裁剪
- ✅ **防抖优化**：200ms 防抖，流畅操作
- ✅ **实时预览**：所有调整实时显示

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- pnpm >= 8.0.0（推荐）或 npm >= 9.0.0

### 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install
```

### 启动开发服务器

```bash
# 使用 pnpm
pnpm dev

# 或使用 npm
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
# 使用 pnpm
pnpm build

# 或使用 npm
npm run build
```

构建产物将生成在 `dist/` 目录。

### 预览生产版本

```bash
# 使用 pnpm
pnpm preview

# 或使用 npm
npm run preview
```

## 🐳 Docker 部署

### 方式一：使用 Docker Compose（推荐）

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down
```

访问 http://localhost:3000

### 方式二：使用 Docker 命令

```bash
# 构建镜像
docker build -t image-editor .

# 运行容器
docker run -p 3000:3000 image-editor
```

## 📁 项目结构

```
src/
├── canvas/                    # Canvas 图像处理核心
│   ├── filters.ts            # 基础滤镜算法
│   ├── advancedFilters.ts    # 高级滤镜算法
│   ├── useCanvas.ts          # Canvas 管理器
│   └── history.ts            # 历史记录管理
├── components/               # React 组件
│   ├── Sidebar.tsx          # 侧边栏控制面板
│   ├── Slider.tsx           # 滑块组件
│   ├── Button.tsx           # 按钮组件
│   ├── Toolbar.tsx          # 工具栏
│   ├── Histogram.tsx        # 直方图组件
│   └── CropOverlay.tsx      # 裁剪覆盖层
├── pages/                    # 页面组件
│   └── Editor.tsx           # 主编辑器页面
├── utils/                    # 工具函数
│   └── image.ts             # 图像处理工具
└── App.tsx                   # 应用根组件
```

## 🎯 使用指南

### 基础操作

1. **导入图片**
   - 点击左侧"导入"按钮选择图片
   - 或直接拖拽图片到画布区域

2. **调整图像**
   - 使用左侧滑块调整各项参数
   - 支持键盘输入精确数值
   - 实时预览调整效果

3. **查看对比**
   - 点击画布下方的"处理后"/"原图"/"对比"按钮
   - 对比模式下可并排查看原图和处理后的效果

4. **导出图像**
   - 点击"导出"按钮保存处理后的图片
   - 支持 PNG 和 JPEG 格式

### 高级功能

#### 直方图均衡
- 点击"显示直方图"查看图像的色彩分布
- 调整均衡强度（0-100%）
- 选择均衡模式：
  - **亮度模式**：基于灰度值均衡，保持色彩平衡
  - **RGB 模式**：独立均衡三通道，可能改变色彩

#### 中值滤波
- 适合去除椒盐噪声
- 半径 1-2px 适合轻微去噪
- 半径 3px 适合强力去噪

#### 高斯模糊
- 适合平滑图像和去除高斯噪声
- σ = 0.5-1.5 适合轻微平滑
- σ = 2-3 适合明显模糊

#### 边缘检测
- **Sobel**：最常用，效果平衡
- **Prewitt**：类似 Sobel，计算简单
- **Roberts**：最快速，适合清晰边缘

## 🔧 技术栈

### 核心技术
- **React 18.2.0**：现代化 UI 框架
- **TypeScript 5.0**：类型安全
- **Vite 5.4**：快速构建工具

### UI 框架
- **Tailwind CSS 3.4**：实用优先的 CSS 框架

### 图像处理
- **HTML5 Canvas API**：底层图像处理
- **自定义算法**：纯 TypeScript 实现的图像处理算法

### 开发工具
- **ESLint**：代码质量检查
- **PostCSS**：CSS 处理
- **Docker**：容器化部署

## 📊 性能优化

### 已实现的优化
1. **防抖处理**：200ms 防抖，减少不必要的计算
2. **离屏渲染**：使用离屏 Canvas 提高性能
3. **参数限制**：限制高计算量滤镜的最大值
4. **非破坏性编辑**：基于原图应用调整，保证质量
5. **历史记录管理**：高效的撤销/重做机制

### 性能指标
- 基础调整：< 50ms
- 模糊/锐化：< 200ms（800×600 图像）
- 中值滤波：< 500ms（800×600 图像，半径 3）
- 高斯模糊：< 400ms（800×600 图像，σ=3）
- 边缘检测：< 300ms（800×600 图像）

## 🎓 算法说明

### 直方图均衡
通过重新分布像素值来增强图像对比度。

**亮度模式**：
```
1. 转换为灰度图
2. 计算灰度直方图
3. 计算累积分布函数（CDF）
4. 归一化 CDF
5. 映射回原图
```

**RGB 模式**：
```
对每个通道独立执行：
1. 计算该通道的直方图
2. 计算 CDF
3. 归一化并映射
```

### 中值滤波
```
对每个像素：
1. 取邻域内所有像素
2. 对 RGB 各通道排序
3. 取中值替换当前像素
```

### 高斯模糊
```
1. 生成高斯核：G(x,y) = exp(-(x²+y²)/(2σ²))
2. 归一化核
3. 对图像进行卷积
```

### Sobel 边缘检测
```
水平核 Gx:        垂直核 Gy:
[-1  0  1]        [-1 -2 -1]
[-2  0  2]        [ 0  0  0]
[-1  0  1]        [ 1  2  1]

梯度幅值: G = √(Gx² + Gy²)
```

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范
- 使用 TypeScript
- 遵循 ESLint 规则
- 添加必要的注释
- 编写清晰的提交信息

## 📝 更新日志

### v1.0.0 (2024-11-05)

#### 新增功能
- ✨ 完整的图像编辑功能
- ✨ RGB 通道独立调节
- ✨ 直方图显示与均衡
- ✨ 6 种高级图像处理算法
- ✨ 对比模式查看
- ✨ 滑块键盘输入支持

#### 性能优化
- ⚡ 防抖优化（200ms）
- ⚡ 降低高计算量滤镜的最大值
- ⚡ 离屏渲染提升性能

#### 问题修复
- 🐛 修复模糊滑块无反应问题
- 🐛 修复中值滤波和高斯模糊卡顿
- 🐛 修复直方图均衡非线性问题
- 🐛 修复图像导入错误提示
- 🐛 优化对比模式图片尺寸

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [React](https://reactjs.org/) - UI 框架
- [Vite](https://vitejs.dev/) - 构建工具
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [TypeScript](https://www.typescriptlang.org/) - 类型系统

## 📧 联系方式

如有问题或建议，欢迎通过以下方式联系：

- 提交 [Issue](https://github.com/herbal-rin/Fast-image-processing/issues)
- 发起 [Discussion](https://github.com/herbal-rin/Fast-image-processing/discussions)

## 🌟 Star History

如果这个项目对你有帮助，请给它一个 ⭐️！

---

**Made with ❤️ by herbal-rin**
