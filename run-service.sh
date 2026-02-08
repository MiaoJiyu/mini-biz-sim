#!/bin/bash

# 获取脚本所在目录的绝对路径
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# 加载 .env 文件中的环境变量
if [ -f "$SCRIPT_DIR/.env" ]; then
    export $(cat "$SCRIPT_DIR/.env" | grep -v '^#' | xargs)
fi

# 检查是否提供了服务名称参数
if [ -z "$1" ]; then
    echo "用法: $0 <service-name>"
    echo "可用服务: gateway, user-service, stock-service, real-estate-service, bank-service, mall-service, event-service"
    exit 1
fi

SERVICE=$1
SERVICE_DIR="$SCRIPT_DIR/backend/$SERVICE"

# 检查服务目录是否存在
if [ ! -d "$SERVICE_DIR" ]; then
    echo "错误: 服务目录 $SERVICE_DIR 不存在"
    exit 1
fi

# 切换到服务目录并启动
cd "$SERVICE_DIR"
echo "正在启动 $SERVICE ..."
mvn spring-boot:run
