# 🎨 图像处理编辑器

一个功能强大的前端图像处理应用，基于 React + TypeScript + Vite 构建，提供专业的图像编辑和处理功能。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6.svg)
![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg)

## ✨ 核心特性

### 🖼️ 基础功能
- ✅ **图像导入**: 支持点击按钮和拖拽导入
- ✅ **多种视图模式**: 适配、1:1、填充
- ✅ **对比模式**: 原图、处理后、并排对比（上下全图显示）
- ✅ **撤销/重做**: 完整的历史记录管理
- ✅ **导出功能**: 支持 PNG/JPEG 格式
- ✅ **键盘快捷键**: Ctrl+Z/Y 撤销重做，Ctrl+S 保存

### 🎛️ 图像调整
- ✅ **基础调整**: 亮度、对比度、饱和度（-100% ~ +100%）
- ✅ **RGB通道调节**: 独立调节红、绿、蓝通道
- ✅ **HSI色彩空间**: 支持色相、饱和度、亮度调节
- ✅ **精确输入**: 滑块支持键盘输入数值

### 🎨 滤镜效果
- ✅ **基础滤镜**: 灰度、反相
- ✅ **模糊效果**: 可调强度（0-10px）
- ✅ **锐化效果**: 可调强度（0-100%）
- ✅ **直方图均衡**: 
  - 亮度模式：基于灰度的全局均衡
  - RGB模式：独立均衡三通道
  - 可调强度（0-100%）
  - 实时直方图显示

### 🔬 高级图像处理算法

#### 平滑算子（去噪）
- ✅ **中值滤波**: 去除椒盐噪声（0-3px）
- ✅ **高斯模糊**: 平滑图像（0-3σ）

#### 锐化算子（增强边缘）
- ✅ **基础锐化**: 可调强度（0-100%）
- ✅ **Laplacian锐化**: 二阶微分增强

#### 边缘检测算子
- ✅ **Sobel边缘检测**: 应用最广泛
- ✅ **Prewitt边缘检测**: 简化梯度算子
- ✅ **Roberts边缘检测**: 快速边缘检测

### 🔄 变换操作
- ✅ **旋转**: 90°、180°、270°
- ✅ **翻转**: 水平翻转、垂直翻转
- ✅ **裁剪**: 可视化矩形选择

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- pnpm >= 8.0.0（推荐）或 npm

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

访问：http://localhost:5173

### 构建生产版本

```bash
# 使用 pnpm
pnpm build

# 或使用 npm
npm run build
```

### 预览生产版本

```bash
pnpm preview
```

## 📦 Docker 部署

### 使用 Docker Compose（推荐）

```bash
# 构建并启动
docker-compose up -d

# 停止服务
docker-compose down
```

访问：http://localhost:3000

### 使用 Docker 命令

```bash
# 构建镜像
docker build -t image-editor .

# 运行容器
docker run -p 3000:3000 image-editor
```

## 🏗️ 项目结构

```
src/
├── canvas/                    # 图像处理核心
│   ├── filters.ts            # 基础滤镜算法
│   ├── advancedFilters.ts    # 高级滤镜算法
│   ├── useCanvas.ts          # Canvas管理器
│   └── history.ts            # 历史记录管理
├── components/               # UI组件
│   ├── Sidebar.tsx          # 侧边栏控制面板
│   ├── Slider.tsx           # 滑块组件
│   ├── Button.tsx           # 按钮组件
│   ├── Toolbar.tsx          # 工具栏
│   ├── Histogram.tsx        # 直方图显示
│   └── CropOverlay.tsx      # 裁剪覆盖层
├── pages/                   # 页面
│   └── Editor.tsx           # 主编辑器页面
├── utils/                   # 工具函数
│   └── image.ts            # 图像处理工具
└── App.tsx                 # 应用入口
```

## 🎯 使用指南

### 基础操作

1. **导入图片**
   - 点击"导入"按钮选择图片
   - 或直接拖拽图片到画布

2. **调整图像**
   - 使用侧边栏的滑块调整参数
   - 支持键盘输入精确数值
   - 实时预览效果

3. **对比查看**
   - 点击"处理后"查看处理结果
   - 点击"原图"查看原始图像
   - 点击"对比"上下并排对比

4. **导出图片**
   - 点击"导出"按钮
   - 自动保存为 PNG 格式

### 滤镜使用建议

#### 去噪处理
- **椒盐噪声**: 使用中值滤波（1-2px）
- **高斯噪声**: 使用高斯模糊（0.5-1.5σ）

#### 锐化处理
- **轻微锐化**: 20-40%
- **中等锐化**: 50-70%
- **强烈锐化**: 80-100%
- ⚠️ 建议先去噪再锐化

#### 边缘检测
- **通用场景**: Sobel算子
- **快速检测**: Roberts算子
- **平滑边缘**: Prewitt算子

#### 直方图均衡
- **亮度模式**: 适合整体对比度增强
- **RGB模式**: 适合色彩丰富的图像
- **强度**: 建议从50%开始调整

## 🔧 技术栈

### 前端框架
- **React 18**: 现代化UI框架
- **TypeScript**: 类型安全
- **Vite**: 快速构建工具

### 样式方案
- **Tailwind CSS**: 实用优先的CSS框架
- **PostCSS**: CSS处理工具

### 图像处理
- **HTML5 Canvas**: 底层渲染
- **Canvas API**: 像素级操作
- **自定义算法**: 专业图像处理算法

### 开发工具
- **ESLint**: 代码质量检查
- **TypeScript**: 静态类型检查
- **pnpm**: 快速包管理器

## 📊 性能优化

- ✅ **防抖处理**: 200ms防抖，避免频繁计算
- ✅ **离屏渲染**: 使用离屏Canvas提高性能
- ✅ **非破坏性编辑**: 基于原图应用所有调整
- ✅ **内存优化**: 及时释放临时数组
- ✅ **算法优化**: 限制滤镜参数范围，降低计算复杂度

## 🎨 算法实现

### 卷积滤镜
- 模糊、锐化使用3×3卷积核
- 高斯模糊动态生成高斯核
- 边缘检测使用Sobel/Prewitt/Roberts算子

### 直方图处理
- 累积分布函数（CDF）计算
- 自适应强度混合
- RGB通道独立处理

### 色彩空间转换
- RGB ↔ HSI 转换
- 灰度转换（加权平均）

## 📝 开发文档

项目包含详细的开发文档：

- `FEATURES.md` - 功能特性详细说明
- `ADVANCED_FILTERS_GUIDE.md` - 高级滤镜使用指南
- `HISTOGRAM_GUIDE.md` - 直方图功能说明
- `COMPARE_MODE_OPTIMIZATION.md` - 对比模式优化
- `FILTERS_FIX_SUMMARY.md` - 滤镜问题修复总结
- `IMPLEMENTATION_SUMMARY.md` - 实现总结

## 🐛 问题反馈

如果您在使用过程中遇到问题，请：

1. 检查浏览器控制台是否有错误信息
2. 确认图片格式是否支持（支持 JPG、PNG、GIF、WebP）
3. 尝试刷新页面重新导入图片
4. 提交 Issue 到 GitHub

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [React](https://reactjs.org/) - UI框架
- [Vite](https://vitejs.dev/) - 构建工具
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [TypeScript](https://www.typescriptlang.org/) - 类型系统

## 📮 联系方式

- GitHub: [@herbal-rin](https://github.com/herbal-rin)
- 项目地址: [Fast-image-processing](https://github.com/herbal-rin/Fast-image-processing)

## 🎉 更新日志

### v1.0.0 (2024-11-05)

#### 新增功能
- ✨ 完整的图像编辑功能
- ✨ RGB/HSI色彩空间调节
- ✨ 直方图显示与均衡
- ✨ 多种平滑、锐化、边缘检测算子
- ✨ 对比模式（上下全图对比）
- ✨ 滑块支持键盘输入

#### 性能优化
- ⚡ 优化中值滤波和高斯模糊性能
- ⚡ 增加防抖时间至200ms
- ⚡ 降低滤镜最大值，减少计算量

#### 问题修复
- 🐛 修复模糊滑块无反应问题
- 🐛 修复高级滤镜卡顿问题
- 🐛 修复直方图均衡非线性问题
- 🐛 修复图像导入错误提示

---

**Made with ❤️ by herbal-rin**
