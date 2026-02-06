# 财商学堂 | FinanceLab - 综合性财商教育模拟平台

## 📚 项目介绍

财商学堂 (FinanceLab) 是一个基于网页的综合性财商教育模拟平台，专门为学校课间活动和金融教育课程设计。通过模拟真实的金融市场环境、商业运营场景和消费决策环境，让学生在安全可控的虚拟世界中系统性学习财商概念。

## 🌟 核心特性

- 🏦 **多角色用户系统**：学生、教师、管理员三级权限体系
- 📈 **股票市场模拟**：实时行情、K线图、交易系统
- 💰 **银行信贷系统**：普通贷款、杠杆贷款、风控机制
- 🏠 **房地产投资**：城市地产数据库、房产交易、出租管理
- 🏭 **工商业经营**：工厂建设、生产管理、销售系统
- 🏬 **商场消费**：增益物品、功能物品、装饰物品
- 🎲 **随机事件**：宏观、行业、公司、个人事件
- 👥 **权限管理**：精细化权限控制，多租户数据隔离
- 🧭 **新手引导**：分层引导系统，自适应难度

## 🏗️ 技术架构

### 前端技术栈
- React 18 + TypeScript
- Tailwind CSS + Shadcn/ui
- Vite 构建工具
- WebSocket 实时通信
- ECharts 数据可视化

### 后端技术栈
- Java 17 + Spring Boot 3.x
- MySQL 8.0 数据库
- Redis 缓存
- JWT Token 认证
- WebSocket 实时推送

### 开发环境
- Node.js 18+
- Java 17+
- MySQL 8.0+
- Redis 7.0+

## 📁 项目结构

```
mini-biz-sim/
├── frontend/                 # React 前端项目
├── backend/                  # Spring Boot 后端项目
├── database/                 # 数据库脚本
├── docker/                   # Docker 配置文件
└── docs/                     # 项目文档
```

## 🚀 快速开始

### 环境准备

```bash
# 安装 Node.js 18+
# 安装 Java 17+
# 安装 MySQL 8.0+
# 安装 Redis 7.0+
```

### 前端启动

```bash
cd frontend
npm install
npm run dev
```

### 后端启动

```bash
cd backend
./mvnw spring-boot:run
```

## 📖 开发文档

- [API 接口文档](./docs/api.md)
- [数据库设计文档](./docs/database.md)
- [部署指南](./docs/deployment.md)
- [用户手册](./docs/user-guide.md)

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！请参考：[贡献指南](./docs/contributing.md)

## 📄 许可证

本项目基于 MIT 许可证开源，详情请见 [LICENSE](./LICENSE) 文件。

## 📞 联系我们

- 项目主页：https://github.com/financelab/mini-biz-sim
- 问题反馈：https://github.com/financelab/mini-biz-sim/issues
- 邮箱：contact@financelab.edu