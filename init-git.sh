#!/bin/bash

# Git仓库初始化脚本

echo "🔧 初始化Git仓库..."

# 初始化Git仓库
git init

# 添加所有文件
git add .

# 创建初始提交
git commit -m "🎨 初始提交: 图像处理编辑器

✨ 功能特性:
- 图像导入（点击按钮 + 拖拽）
- 基础调整（亮度、对比度、饱和度）
- 滤镜效果（灰度、反相、模糊、锐化）
- 变换操作（旋转、翻转）
- 裁剪功能（矩形选择）
- 撤销/重做功能
- 导出功能（PNG/JPEG）
- 视图模式切换
- 键盘快捷键支持

🛠️ 技术栈:
- React 18 + TypeScript + Vite
- Tailwind CSS
- HTML5 Canvas
- pnpm

📦 部署方式:
- Docker部署
- 本地运行
- 在线部署（Vercel/Netlify/GitHub Pages）"

echo "✅ Git仓库初始化完成！"
echo ""
echo "📋 下一步操作:"
echo "1. 添加远程仓库: git remote add origin <your-repo-url>"
echo "2. 推送到远程: git push -u origin main"
echo "3. 或者使用GitHub CLI: gh repo create image-editor --public"
