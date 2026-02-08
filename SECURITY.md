# 安全加固指南

本文档描述了项目中的安全配置项和最佳实践。

## ✅ 已实现的安全措施

### 1. 环境变量管理
- 所有敏感配置（密码、密钥等）通过 `.env` 文件管理
- `.env` 文件已添加到 `.gitignore`，不会被提交到版本控制
- 所有服务在启动时从项目根目录的 `.env` 文件读取配置
- 提供了 `.env.example` 模板文件

### 2. 数据库安全
- 所有数据库连接使用 SSL (`useSSL=true`)
- 密码通过环境变量注入，未硬编码
- 开发环境使用 `ddl-auto=update`，生产环境建议使用 `none` 或 `validate`

### 3. JWT 认证
- 使用 HS256 算法签名 JWT Token
- 密钥长度至少 256 位（32字节）
- User Service 负责签发，Gateway 负责验证
- Token 包含用户 ID 和角色信息

### 4. CORS 配置
- Gateway 层面统一配置 CORS
- 通过环境变量 `CORS_ALLOWED_ORIGINS` 控制允许的来源
- 允许凭据传递 (`allowCredentials: true`)

### 5. 日志管理
- 生产环境日志级别默认为 `INFO`
- 可通过 `LOG_LEVEL` 环境变量调整
- 敏感框架的日志级别设置为 `WARN` 或更高

### 6. Actuator 端点
- 仅暴露 `health` 端点
- 健康检查详情仅在授权时显示 (`when-authorized`)

### 7. 密码存储
- 使用 BCrypt 算法加密用户密码
- 禁用 HTTP Basic 认证，仅使用 JWT Token

## ⚠️ 生产环境部署检查清单

### 必须修改的配置

1. **数据库密码**
   ```bash
   # 在 .env 中修改为强密码
   DB_ROOT_PASSWORD=<强密码，至少16位，包含大小写字母、数字和特殊字符>
   ```

2. **JWT 密钥**
   ```bash
   # 在 .env 中使用随机生成的强密钥（至少256位）
   JWT_SECRET=<随机生成的强密钥>
   ```

3. **CORS 配置**
   ```bash
   # 仅允许生产环境的域名
   CORS_ALLOWED_ORIGINS=https://yourdomain.com
   ```

4. **JPA DDL 模式**
   ```bash
   # 生产环境禁用自动 DDL
   JPA_DDL_AUTO=none
   # 或使用 validate 验证但不修改
   # JPA_DDL_AUTO=validate
   ```

5. **日志级别**
   ```bash
   # 生产环境使用 INFO 或 WARN
   LOG_LEVEL=INFO
   ```

### 推荐的安全措施

1. **启用 HTTPS**
   - 在 Nginx 或负载均衡层配置 SSL 证书
   - 重定向所有 HTTP 请求到 HTTPS

2. **数据库用户权限**
   - 为每个服务创建独立的数据库用户
   - 授予最小必要权限
   - 示例：
     ```sql
     CREATE USER 'financelab_user'@'%' IDENTIFIED BY 'password';
     GRANT SELECT, INSERT, UPDATE, DELETE ON financelab_users.* TO 'financelab_user'@'%';
     ```

3. **Redis 密码**
   ```bash
   # 在 Redis 配置中设置密码
   REDIS_PASSWORD=<强密码>
   ```

4. **限流配置**
   - Gateway 已实现基础限流
   - 可根据实际需求调整 `rateLimit` 和 `timeWindow` 参数

5. **监控和告警**
   - 配置日志收集（ELK Stack、Loki 等）
   - 设置异常登录、高频访问等告警

6. **定期更新依赖**
   ```bash
   # 检查漏洞依赖
   mvn org.owasp:dependency-check-maven:check
   ```

## 📋 安全检查清单

### 代码层面
- [x] 禁用 HTTP Basic 认证
- [x] 禁用 CSRF（REST API 不需要）
- [x] 使用 Stateless Session
- [x] 密码使用 BCrypt 加密
- [x] JWT 使用足够长的密钥
- [x] 未硬编码敏感信息
- [x] 正确处理异常（避免信息泄露）

### 配置层面
- [x] 数据库使用 SSL 连接
- [x] 日志级别为 INFO/WARN（生产）
- [x] CORS 配置受限
- [x] Actuator 端点最小化暴露
- [x] 敏感配置通过环境变量注入
- [x] `.env` 在 `.gitignore` 中

### 运维层面
- [ ] 使用 HTTPS
- [ ] 配置防火墙规则
- [ ] 数据库用户权限分离
- [ ] 定期备份
- [ ] 日志审计
- [ ] 依赖漏洞扫描
- [ ] 安全补丁更新

## 🔧 本地开发安全建议

1. **保持默认配置**
   - 使用 `.env.example` 作为模板
   - 不要提交包含真实密码的 `.env` 文件

2. **使用 DEBUG 日志时注意**
   ```bash
   # .env 中设置
   LOG_LEVEL=DEBUG
   ```
   - 确保不要在生产环境使用 DEBUG
   - DEBUG 日志可能泄露 SQL 语句和请求参数

3. **数据库连接**
   - 本地开发可以使用 `useSSL=false`（MySQL 8.0+ 可能需要）
   - 如需 SSL，确保 MySQL 服务器启用了 SSL

## 🚨 常见安全问题

### 1. CORS 配置错误
**症状**：浏览器报跨域错误或允许所有来源
**解决**：在 `.env` 中正确设置 `CORS_ALLOWED_ORIGINS`

### 2. Token 验证失败
**症状**：请求返回 401 Unauthorized
**原因**：
- JWT_SECRET 不一致
- Token 过期
- Token 被篡改

### 3. 数据库连接失败
**症状**：启动时报连接错误
**原因**：
- MySQL 未启用 SSL（但配置要求 SSL）
- 密码错误
- 数据库未启动

### 4. 敏感信息泄露
**预防措施**：
- 使用 INFO/WARN 日志级别
- 不在日志中打印密码
- 不在异常消息中返回敏感信息

## 📚 参考资源

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Spring Boot Security](https://docs.spring.io/spring-boot/docs/current/reference/html/web.html#web.security)

## 最后更新
- 日期：2025-02-08
- 版本：1.0
