#!/bin/bash

# 图像处理编辑器 - 一键启动脚本

echo "🎨 图像处理编辑器 - 启动脚本"
echo "================================"

# 检查当前目录
if [ ! -f "package.json" ]; then
    echo "❌ 请在项目根目录运行此脚本"
    exit 1
fi

# 检查Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js 已安装: $(node --version)"
else
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

# 检查pnpm
if command -v pnpm &> /dev/null; then
    echo "✅ pnpm 已安装: $(pnpm --version)"
    PACKAGE_MANAGER="pnpm"
elif command -v npm &> /dev/null; then
    echo "✅ npm 已安装: $(npm --version)"
    PACKAGE_MANAGER="npm"
else
    echo "❌ 未找到包管理器"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖..."
if [ "$PACKAGE_MANAGER" = "pnpm" ]; then
    pnpm install
else
    npm install
fi

# 启动开发服务器
echo "🚀 启动开发服务器..."
if [ "$PACKAGE_MANAGER" = "pnpm" ]; then
    pnpm dev
else
    npm run dev
fi
