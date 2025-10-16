# Docker构建和运行脚本

# 构建Docker镜像
docker build -t image-editor .

# 运行容器
docker run -p 3000:3000 image-editor

# 或者使用docker-compose
docker-compose up -d
