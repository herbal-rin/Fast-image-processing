#!/bin/bash

# 图像处理编辑器 - 一键部署脚本

set -e

echo "🚀 图像处理编辑器 - 部署脚本"
echo "================================"

# 检查Docker是否安装
if command -v docker &> /dev/null; then
    echo "✅ Docker 已安装"
    
    # 检查docker-compose是否安装
    if command -v docker-compose &> /dev/null; then
        echo "✅ Docker Compose 已安装"
        
        echo "📦 使用Docker Compose部署..."
        docker-compose up -d
        
        echo "🎉 部署完成！"
        echo "🌐 访问地址: http://localhost:3000"
        echo "📋 查看日志: docker-compose logs -f"
        echo "🛑 停止服务: docker-compose down"
        
    else
        echo "⚠️  Docker Compose 未安装，使用Docker手动部署..."
        
        echo "🔨 构建Docker镜像..."
        docker build -t image-editor .
        
        echo "🚀 启动容器..."
        docker run -d -p 3000:3000 --name image-editor-app image-editor
        
        echo "🎉 部署完成！"
        echo "🌐 访问地址: http://localhost:3000"
        echo "📋 查看日志: docker logs -f image-editor-app"
        echo "🛑 停止服务: docker stop image-editor-app"
    fi
    
else
    echo "❌ Docker 未安装"
    echo "📝 请先安装Docker: https://docs.docker.com/get-docker/"
    echo ""
    echo "🔄 或者使用本地Node.js运行:"
    echo "   pnpm install"
    echo "   pnpm dev"
    exit 1
fi
