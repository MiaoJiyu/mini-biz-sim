# Event Service - 随机事件系统服务

## 概述
事件服务负责管理系统中的随机事件,提供事件触发、响应和处理功能。

## 功能特性

### 1. 事件管理
- **事件类型**: 正面事件、负面事件、市场崩盘、经济繁荣、自然灾害等
- **事件严重程度**: LOW、MEDIUM、HIGH、CRITICAL
- **事件分类**: MARKET、CAREER、REAL_ESTATE、FINANCIAL、HEALTH、SOCIETY等

### 2. 随机事件调度
- 定期触发随机市场事件(每5分钟)
- 每日随机事件(每6小时)
- 自动清理过期事件(每天)

### 3. 事件响应系统
- 用户可以选择不同的应对方案
- 每个选择有不同的影响和后果
- 记录用户选择和处理结果

### 4. 实时通知
- WebSocket实时推送新事件
- 前端事件通知组件
- 待处理事件提醒

## API 接口

### 事件管理
- `GET /api/events` - 获取所有活动事件
- `GET /api/events/{id}` - 获取指定事件详情
- `GET /api/events/category/{category}` - 按分类获取事件
- `GET /api/events/type/{type}` - 按类型获取事件
- `GET /api/events/{id}/choices` - 获取事件选项
- `POST /api/events` - 创建新事件
- `PUT /api/events/{id}` - 更新事件
- `DELETE /api/events/{id}` - 删除事件

### 事件触发
- `POST /api/events/{id}/trigger?userId={userId}` - 触发指定事件
- `POST /api/events/random` - 触发随机事件(不指定用户)
- `POST /api/events/random/{userId}` - 为用户触发随机事件

### 用户事件
- `GET /api/user-events/user/{userId}` - 获取用户所有事件
- `GET /api/user-events/user/{userId}/pending` - 获取待处理事件
- `GET /api/user-events/user/{userId}/count` - 获取待处理事件数量
- `GET /api/user-events/user/{userId}/has-pending` - 检查是否有待处理事件
- `POST /api/user-events/{id}/resolve` - 解析事件

## WebSocket
- 连接端点: `ws://localhost:8085/ws/events`
- 消息格式:
  ```json
  {
    "type": "EVENT",
    "eventId": 1,
    "title": "股市崩盘",
    "description": "全球股市突然大幅下跌",
    "severity": "HIGH",
    "timestamp": 1707192000000
  }
  ```

## 数据库结构

### events 表
```sql
CREATE TABLE events (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    probability INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    effects JSON,
    active BOOLEAN NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME
);
```

### user_events 表
```sql
CREATE TABLE user_events (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(50),
    severity VARCHAR(20),
    effects JSON,
    triggered_at DATETIME NOT NULL,
    resolved_at DATETIME,
    resolved BOOLEAN NOT NULL,
    user_choice TEXT,
    outcome TEXT
);
```

### event_choices 表
```sql
CREATE TABLE event_choices (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    event_id BIGINT NOT NULL,
    choice_text VARCHAR(200) NOT NULL,
    description TEXT,
    consequences JSON,
    required_level INT NOT NULL,
    financial_impact DECIMAL(15,2) NOT NULL,
    active BOOLEAN NOT NULL,
    created_at DATETIME NOT NULL
);
```

## 配置说明

### application.yml
```yaml
server:
  port: 8085

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/financelab_events
    username: root
    password: root

  jpa:
    hibernate:
      ddl-auto: update
```

## 与其他服务集成

### 股票市场服务
- 市场崩盘事件会影响股票价格
- 经济繁荣事件会提升股票价值

### 房地产服务
- 房产升值事件增加房产价值
- 自然灾害影响房产租金

### 银行服务
- 利率调整影响贷款利率
- 政策利好影响存款利率

### 商场服务
- 通货膨胀影响商品价格
- 意外之财增加可消费金额

## 运行说明

1. 启动数据库服务
```bash
mysql -u root -p < database/06_events.sql
```

2. 启动事件服务
```bash
cd backend/event-service
mvn spring-boot:run
```

3. 服务将自动启动并开始调度随机事件

## 扩展建议

1. **事件链系统**: 实现事件的连锁反应
2. **条件事件**: 基于用户状态触发特定事件
3. **事件统计**: 分析用户事件处理模式和偏好
4. **事件成就**: 解锁与事件相关的成就系统
5. **多人事件**: 支持团队或群组事件
