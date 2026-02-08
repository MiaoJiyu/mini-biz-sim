# 财商学堂 FinanceLab - 部署文档

## 目录

- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [数据库配置](#数据库配置)
- [后端部署](#后端部署)
- [前端部署](#前端部署)
- [Docker部署](#docker部署)
- [生产环境配置](#生产环境配置)
- [常见问题](#常见问题)
- [监控和维护](#监控和维护)

---

## 环境要求

### 硬件要求

| 组件 | 最低配置 | 推荐配置 |
|------|---------|---------|
| CPU | 2核 | 4核+ |
| 内存 | 4GB | 8GB+ |
| 硬盘 | 20GB | 50GB+ |
| 网络 | 10Mbps | 100Mbps+ |

### 软件要求

| 软件 | 版本要求 | 说明 |
|------|---------|------|
| Java JDK | 17+ | 后端运行环境 |
| Node.js | 18+ | 前端构建和运行 |
| MySQL | 8.0+ | 数据库服务 |
| Maven | 3.8+ | 后端构建工具 |
| Docker | 20.10+ | 容器化部署(可选) |
| Docker Compose | 2.0+ | 容器编排(可选) |
| Nginx | 1.18+ | 反向代理(生产环境推荐) |

### 操作系统

- Linux: Ubuntu 20.04+, CentOS 7+, Debian 10+
- Windows: Windows 10/11 (开发环境)
- macOS: macOS 10.15+ (开发环境)

---

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd mini-biz-sim
```

### 2. 安装依赖

#### 后端依赖安装

```bash
cd backend
mvn clean install
```

#### 前端依赖安装

```bash
cd frontend
npm install
```

### 3. 配置数据库

创建数据库并执行初始化脚本:

```bash
# 方式一: 使用统一的初始化脚本 (推荐)
mysql -u root -p < database/init.sql

# 方式二: 按服务分别执行 (如果使用独立数据库)
mysql -u root -p < database/stock-service.sql
mysql -u root -p < database/real-estate-service.sql
mysql -u root -p < database/bank-service.sql
mysql -u root -p < database/mall-service.sql
mysql -u root -p < database/06_events.sql
```

### 4. 启动服务

#### 方法一：使用启动脚本（推荐）

项目提供了便捷的启动脚本 `run-service.sh`，会自动加载 `.env` 文件中的环境变量：

```bash
# 启动各个服务（每次一个终端）
cd /opt/mini-biz-sim
./run-service.sh user-service         # 启动用户服务
./run-service.sh stock-service         # 启动股票服务
./run-service.sh real-estate-service  # 启动房地产服务
./run-service.sh bank-service           # 启动银行服务
./run-service.sh mall-service           # 启动商场服务
./run-service.sh event-service         # 启动事件服务
./run-service.sh gateway               # 启动网关服务
```

**重要提示**：请确保 `.env` 文件存在于项目根目录，并且配置了正确的环境变量。

#### 方法二：直接使用Maven启动

```bash
# 在新终端中启动各个服务
cd backend/user-service && mvn spring-boot:run
cd backend/stock-service && mvn spring-boot:run
cd backend/real-estate-service && mvn spring-boot:run
cd backend/bank-service && mvn spring-boot:run
cd backend/mall-service && mvn spring-boot:run
cd backend/event-service && mvn spring-boot:run
cd backend/gateway && mvn spring-boot:run
```

#### 启动前端服务

```bash
cd frontend
npm run dev
```

### 5. 访问应用

- 前端应用: http://localhost:5173
- API网关: http://localhost:8080

---

## 数据库配置

### 数据库连接配置

各服务的 `application.yml` 需要配置数据库连接信息:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/financelab_xxx?useSSL=false&serverTimezone=UTC
    username: your_username
    password: your_password
    driver-class-name: com.mysql.cj.jdbc.Driver
```

### 数据库用户权限配置

生产环境建议创建专用数据库用户:

```sql
-- 创建专用用户
CREATE USER 'financelab'@'localhost' IDENTIFIED BY 'StrongPassword123!';

-- 授权所有数据库
GRANT ALL PRIVILEGES ON financelab_%.* TO 'financelab'@'localhost';

-- 刷新权限
FLUSH PRIVILEGES;
```

### 数据库优化配置

在 `my.cnf` 中添加以下优化配置:

```ini
[mysqld]
# 连接数配置
max_connections = 500
max_user_connections = 450

# 缓冲区配置
innodb_buffer_pool_size = 2G
innodb_log_file_size = 512M
innodb_flush_log_at_trx_commit = 2

# 查询缓存
query_cache_size = 64M
query_cache_limit = 2M

# 日志配置
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow-query.log
long_query_time = 2

# 字符集
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
```

---

## 后端部署

### 1. 编译打包

```bash
cd backend
mvn clean package -DskipTests
```

编译后的JAR文件位于各服务的 `target` 目录:

```
backend/user-service/target/user-service-1.0.0.jar
backend/stock-service/target/stock-service-1.0.0.jar
backend/real-estate-service/target/real-estate-service-1.0.0.jar
backend/bank-service/target/bank-service-1.0.0.jar
backend/mall-service/target/mall-service-1.0.0.jar
backend/event-service/target/event-service-1.0.0.jar
backend/gateway/target/gateway-1.0.0.jar
```

### 2. 环境变量配置

项目使用 `.env` 文件管理环境变量。创建项目根目录下的 `.env` 文件：

```bash
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_ROOT_USER=root
DB_ROOT_PASSWORD=your-database-password

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DATABASE=0

# JWT配置 - 重要：密钥必须至少32字节（256位）
JWT_SECRET=YourSecureSecretKeyWithAtLeast32CharactersLengthForHS256
JWT_EXPIRATION=86400000

# 各服务数据库名称
DB_NAME_USERS=financelab_users
DB_NAME_STOCKS=financelab_stocks
DB_NAME_REALESTATE=financelab_realestate
DB_NAME_BANK=financelab_bank
DB_NAME_MALL=financelab_mall
DB_NAME_EVENTS=financelab_events

# 前端 API 配置
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_BASE_URL=ws://localhost:8085
```

**安全注意事项**：
- `.env` 文件包含敏感信息，不要提交到版本控制系统
- 确保 `.gitignore` 文件包含 `.env`
- 在生产环境中，JWT_SECRET 必须使用强随机密钥（至少32字节）
- 使用以下命令生成安全的JWT密钥：`openssl rand -base64 32`

**JWT密钥要求**：
- 长度必须 ≥ 32字节（256位）以符合JWT HMAC-SHA算法安全标准
- 建议在生产环境使用 `openssl rand -base64 32` 生成随机密钥
- Gateway和User Service必须使用相同的JWT_SECRET

### 3. Systemd服务配置

创建服务配置文件 `/etc/systemd/system/financelab-*.service`:

#### Gateway服务
```ini
[Unit]
Description=FinanceLab API Gateway
After=network.target mysql.service

[Service]
Type=simple
User=financelab
WorkingDirectory=/opt/financelab/gateway
Environment="SPRING_PROFILES_ACTIVE=prod"
ExecStart=/usr/bin/java -jar gateway-1.0.0.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

#### User服务
```ini
[Unit]
Description=FinanceLab User Service
After=network.target mysql.service

[Service]
Type=simple
User=financelab
WorkingDirectory=/opt/financelab/user-service
Environment="SPRING_PROFILES_ACTIVE=prod"
ExecStart=/usr/bin/java -jar user-service-1.0.0.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

#### 其他服务同理创建...

### 4. 启动服务

```bash
# 重新加载systemd配置
sudo systemctl daemon-reload

# 启动所有服务
sudo systemctl start financelab-gateway
sudo systemctl start financelab-user
sudo systemctl start financelab-stock
sudo systemctl start financelab-realestate
sudo systemctl start financelab-bank
sudo systemctl start financelab-mall
sudo systemctl start financelab-event

# 设置开机自启
sudo systemctl enable financelab-*

# 查看服务状态
sudo systemctl status financelab-*
```

### 5. Java JVM优化参数

在启动命令中添加JVM参数:

```bash
java -Xms512m -Xmx2g \
     -XX:+UseG1GC \
     -XX:MaxGCPauseMillis=200 \
     -XX:+HeapDumpOnOutOfMemoryError \
     -XX:HeapDumpPath=/var/log/financelab/heapdump.hprof \
     -jar app.jar
```

---

## 前端部署

### 1. 构建生产版本

```bash
cd frontend
npm run build
```

构建后的文件位于 `dist/` 目录。

### 2. Nginx配置

创建Nginx配置文件 `/etc/nginx/sites-available/financelab`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/financelab/dist;
    index index.html;

    # Gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API代理
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket支持
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

启用站点:

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/financelab /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

### 3. SSL/HTTPS配置

使用Let's Encrypt免费SSL证书:

```bash
# 安装certbot
sudo apt install certbot python3-certbot-nginx

# 获取SSL证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

Nginx会自动配置HTTPS重定向。

---

## Docker部署

### 1. 构建镜像

#### 构建后端镜像

```dockerfile
# backend/Dockerfile
FROM maven:3.8-openjdk-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jre-slim
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

```bash
# 构建所有服务镜像
docker build -t financelab/gateway:latest ./gateway
docker build -t financelab/user-service:latest ./user-service
docker build -t financelab/stock-service:latest ./stock-service
docker build -t financelab/realestate-service:latest ./real-estate-service
docker build -t financelab/bank-service:latest ./bank-service
docker build -t financelab/mall-service:latest ./mall-service
docker build -t financelab/event-service:latest ./event-service
```

#### 构建前端镜像

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
docker build -t financelab/frontend:latest ./frontend
```

### 2. Docker Compose部署

创建 `docker-compose.yml`:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: financelab-mysql
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: financelab
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql
      - ./database:/docker-entrypoint-initdb.d
    networks:
      - financelab-net

  gateway:
    image: financelab/gateway:latest
    container_name: financelab-gateway
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/financelab_users
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: rootpassword
    depends_on:
      - user-service
      - stock-service
      - realestate-service
      - bank-service
      - mall-service
      - event-service
    networks:
      - financelab-net

  user-service:
    image: financelab/user-service:latest
    container_name: financelab-user
    ports:
      - "8081:8081"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/financelab_users
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: rootpassword
    depends_on:
      - mysql
    networks:
      - financelab-net

  stock-service:
    image: financelab/stock-service:latest
    container_name: financelab-stock
    ports:
      - "8082:8082"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/financelab_stocks
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: rootpassword
    depends_on:
      - mysql
    networks:
      - financelab-net

  realestate-service:
    image: financelab/realestate-service:latest
    container_name: financelab-realestate
    ports:
      - "8083:8083"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/financelab_realestate
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: rootpassword
    depends_on:
      - mysql
    networks:
      - financelab-net

  bank-service:
    image: financelab/bank-service:latest
    container_name: financelab-bank
    ports:
      - "8084:8084"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/financelab_bank
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: rootpassword
    depends_on:
      - mysql
    networks:
      - financelab-net

  mall-service:
    image: financelab/mall-service:latest
    container_name: financelab-mall
    ports:
      - "8086:8086"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/financelab_mall
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: rootpassword
    depends_on:
      - mysql
    networks:
      - financelab-net

  event-service:
    image: financelab/event-service:latest
    container_name: financelab-event
    ports:
      - "8085:8085"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/financelab_events
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: rootpassword
    depends_on:
      - mysql
    networks:
      - financelab-net

  frontend:
    image: financelab/frontend:latest
    container_name: financelab-frontend
    ports:
      - "80:80"
    depends_on:
      - gateway
    networks:
      - financelab-net

volumes:
  mysql-data:

networks:
  financelab-net:
    driver: bridge
```

### 3. 启动Docker Compose

```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 停止并删除数据
docker-compose down -v
```

---

## 生产环境配置

### 1. 应用配置

创建生产环境配置文件 `application-prod.yml`:

```yaml
spring:
  profiles:
    active: prod

  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000

  jpa:
    show-sql: false
    properties:
      hibernate:
        jdbc:
          batch_size: 50
        order_inserts: true
        order_updates: true
        jdbc:
          batch_versioned_data: true

logging:
  level:
    com.financelab: INFO
    org.springframework: WARN
  file:
    name: /var/log/financelab/application.log
  logback:
    rollingpolicy:
      max-file-size: 100MB
      max-history: 30
```

### 2. 安全配置

#### 修改JWT密钥
```bash
# 生成随机密钥（32字节，符合HMAC-SHA256要求）
openssl rand -base64 32

# 在.env文件中设置
JWT_SECRET=your-generated-secret-key
```

**JWT密钥安全规范**：
- Gateway和User Service必须使用相同的JWT_SECRET
- 密钥长度必须 ≥ 32字节（256位）
- 不得使用弱密钥或短密钥（会导致启动失败）
- 生产环境必须使用强随机密钥
- 密钥更换会导致所有现有token失效

#### 防火墙配置
```bash
# 只开放必要端口
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 22/tcp    # SSH
sudo ufw enable
```

### 3. 备份策略

#### 数据库备份脚本

创建 `/opt/backup/backup-db.sh`:

```bash
#!/bin/bash

BACKUP_DIR="/opt/backup/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
MYSQL_USER="backup_user"
MYSQL_PASSWORD="backup_password"

# 备份所有数据库
for DB in financelab_users financelab_stocks financelab_realestate financelab_bank financelab_mall financelab_events; do
    mysqldump -u $MYSQL_USER -p$MYSQL_PASSWORD $DB | gzip > $BACKUP_DIR/${DB}_${DATE}.sql.gz
done

# 删除7天前的备份
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
```

设置定时任务:
```bash
# 编辑crontab
crontab -e

# 每天凌晨2点备份
0 2 * * * /opt/backup/backup-db.sh
```

---

## 常见问题

### 1. 数据库连接失败

**问题**: `Access denied for user 'root'@'localhost'`

**解决方案**:
```bash
# 检查MySQL服务状态
sudo systemctl status mysql

# 重置root密码
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
FLUSH PRIVILEGES;
```

### 2. 端口被占用

**问题**: `Port 8080 is already in use`

**解决方案**:
```bash
# 查找占用端口的进程
lsof -i :8080

# 或使用netstat
netstat -tlnp | grep 8080

# 杀死进程
kill -9 <PID>

# 或修改application.yml中的端口配置
```

### 3. JWT密钥错误

**问题**: `The specified key byte array is 184 bits which is not secure enough for any JWT HMAC-SHA algorithm`

**解决方案**:
```bash
# 生成符合要求的密钥（至少32字节）
openssl rand -base64 32

# 更新.env文件中的JWT_SECRET
JWT_SECRET=<生成的密钥>

# 确保Gateway和User Service使用相同的JWT_SECRET
# 重启服务以应用新配置
```

### 4. 内存不足

**问题**: `OutOfMemoryError: Java heap space`

**解决方案**:
```bash
# 增加JVM内存
java -Xms1g -Xmx4g -jar app.jar

# 或优化数据库查询,减少内存使用
```

### 4. 前端构建失败

**问题**: `npm install` 依赖冲突

**解决方案**:
```bash
# 清除缓存
rm -rf node_modules package-lock.json

# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com

# 重新安装
npm install
```

### 5. 环境变量未生效

**问题**: 服务启动时无法读取.env文件中的配置

**解决方案**:
```bash
# 方法一：使用run-service.sh脚本（推荐）
cd /opt/mini-biz-sim
./run-service.sh <service-name>

# 方法二：手动加载环境变量
cd /opt/mini-biz-sim
export $(cat .env | grep -v '^#' | xargs)
cd backend/<service-name>
mvn spring-boot:run

# 方法三：在启动命令中直接指定环境变量
cd backend/<service-name>
export JWT_SECRET=your-secret-key
export DB_ROOT_PASSWORD=your-password
mvn spring-boot:run
```

### 6. WebSocket连接失败

**问题**: 前端无法连接WebSocket

**解决方案**:
```nginx
# 在Nginx配置中添加WebSocket支持
location /ws/ {
    proxy_pass http://backend-service;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

---

## 监控和维护

### 1. 应用监控

#### Spring Boot Actuator

在 `pom.xml` 中添加依赖:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

配置端点:

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always
```

访问监控端点:
- 健康检查: http://localhost:8080/actuator/health
- 应用信息: http://localhost:8080/actuator/info
- 性能指标: http://localhost:8080/actuator/metrics

### 2. 日志管理

#### Logback配置

创建 `logback-spring.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>/var/log/financelab/application.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>/var/log/financelab/application.%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <root level="INFO">
        <appender-ref ref="FILE" />
    </root>
</configuration>
```

### 3. 性能监控

#### Prometheus + Grafana

```yaml
# docker-compose.yml 添加监控服务
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    networks:
      - financelab-net

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
    networks:
      - financelab-net
```

### 4. 健康检查脚本

创建 `/opt/scripts/health-check.sh`:

```bash
#!/bin/bash

SERVICES=("8080" "8081" "8082" "8083" "8084" "8085" "8086")

for port in "${SERVICES[@]}"; do
    if curl -sf http://localhost:$port/actuator/health > /dev/null; then
        echo "Service on port $port: HEALTHY"
    else
        echo "Service on port $port: UNHEALTHY"
        # 发送告警邮件
        echo "Service $port is down" | mail -s "Alert" admin@example.com
    fi
done
```

定时检查:
```bash
crontab -e
# 每5分钟检查一次
*/5 * * * * /opt/scripts/health-check.sh
```

---

## 附录

### A. 环境变量清单

| 变量名 | 说明 | 默认值 | 要求 |
|--------|------|--------|------|
| DB_HOST | 数据库主机 | localhost | - |
| DB_PORT | 数据库端口 | 3306 | - |
| DB_ROOT_USER | 数据库用户名 | root | - |
| DB_ROOT_PASSWORD | 数据库密码 | - | 强密码 |
| JWT_SECRET | JWT密钥 | - | ≥32字节（256位） |
| JWT_EXPIRATION | JWT过期时间(毫秒) | 86400000 | - |
| REDIS_HOST | Redis主机 | localhost | - |
| REDIS_PORT | Redis端口 | 6379 | - |
| REDIS_PASSWORD | Redis密码 | - | 可选 |
| DB_NAME_USERS | 用户服务数据库名 | financelab_users | - |
| DB_NAME_STOCKS | 股票服务数据库名 | financelab_stocks | - |
| DB_NAME_REALESTATE | 房地产服务数据库名 | financelab_realestate | - |
| DB_NAME_BANK | 银行服务数据库名 | financelab_bank | - |
| DB_NAME_MALL | 商场服务数据库名 | financelab_mall | - |
| DB_NAME_EVENTS | 事件服务数据库名 | financelab_events | - |

### B. 服务端口分配

| 服务 | 端口 | 说明 |
|------|------|------|
| Gateway | 8080 | API网关 |
| User Service | 8081 | 用户服务 |
| Stock Service | 8082 | 股票服务 |
| Real Estate Service | 8083 | 房地产服务 |
| Bank Service | 8084 | 银行服务 |
| Event Service | 8085 | 事件服务 |
| Mall Service | 8086 | 商场服务 |

### C. 常用命令

```bash
# 查看Java进程
ps aux | grep java

# 查看端口占用
netstat -tlnp | grep <port>

# 查看磁盘使用
df -h

# 查看内存使用
free -h

# 查看CPU使用
top

# 查看Nginx日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# 查看应用日志
tail -f /var/log/financelab/application.log
```

### D. 联系支持

如遇到部署问题,请联系:
- 技术支持: support@example.com
- 文档地址: https://docs.example.com
- 问题反馈: https://github.com/xxx/issues

### E. 启动脚本使用说明

项目提供了 `run-service.sh` 脚本用于便捷启动服务：

**脚本功能**：
- 自动加载 `.env` 文件中的环境变量
- 支持启动各个微服务
- 提供统一的服务启动入口

**使用方法**：
```bash
cd /opt/mini-biz-sim
./run-service.sh <service-name>
```

**可用服务**：
- `gateway` - API网关服务
- `user-service` - 用户服务
- `stock-service` - 股票服务
- `real-estate-service` - 房地产服务
- `bank-service` - 银行服务
- `mall-service` - 商场服务
- `event-service` - 事件服务

**注意事项**：
- 确保在项目根目录执行脚本
- 确保 `.env` 文件存在且配置正确
- 每个服务需要在独立的终端中启动

---

**文档版本**: 1.1.0
**最后更新**: 2026-02-08
**维护者**: FinanceLab Team
