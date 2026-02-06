-- 财商学堂数据库初始化脚本
-- 创建数据库
CREATE DATABASE IF NOT EXISTS financelab CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE financelab;

-- 用户表
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'TEACHER', 'ADMIN') DEFAULT 'STUDENT',
    level INT DEFAULT 1,
    total_assets DECIMAL(15,2) DEFAULT 10000.00,
    cash_balance DECIMAL(15,2) DEFAULT 10000.00,
    credit_score INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    class_id VARCHAR(36) NULL,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_class (class_id)
);

-- 股票表
CREATE TABLE stocks (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    industry VARCHAR(50) NOT NULL,
    current_price DECIMAL(10,2) NOT NULL,
    previous_close DECIMAL(10,2) NOT NULL,
    risk_level INT DEFAULT 5,
    market_cap DECIMAL(15,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_industry (industry)
);

-- 股票持仓表
CREATE TABLE stock_positions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    stock_id VARCHAR(36) NOT NULL,
    quantity INT NOT NULL,
    avg_cost DECIMAL(10,2) NOT NULL,
    current_value DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (stock_id) REFERENCES stocks(id),
    INDEX idx_user_stock (user_id, stock_id)
);

-- 股票交易记录表
CREATE TABLE stock_transactions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    stock_id VARCHAR(36) NOT NULL,
    type ENUM('BUY', 'SELL') NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    commission DECIMAL(10,2) DEFAULT 0.00,
    transaction_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (stock_id) REFERENCES stocks(id),
    INDEX idx_user_time (user_id, transaction_time)
);

-- 房地产表
CREATE TABLE real_estates (
    id VARCHAR(36) PRIMARY KEY,
    city VARCHAR(50) NOT NULL,
    district VARCHAR(50) NOT NULL,
    base_price_per_sqm DECIMAL(10,2) NOT NULL,
    rent_yield DECIMAL(5,4) DEFAULT 0.0300,
    appreciation_potential DECIMAL(5,4) DEFAULT 0.0500,
    risk_coefficient DECIMAL(3,2) DEFAULT 0.50,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_city_district (city, district)
);

-- 房产持有表
CREATE TABLE property_holdings (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    real_estate_id VARCHAR(36) NOT NULL,
    area DECIMAL(10,2) NOT NULL,
    purchase_price DECIMAL(15,2) NOT NULL,
    current_value DECIMAL(15,2) NOT NULL,
    is_rented BOOLEAN DEFAULT FALSE,
    monthly_rent DECIMAL(10,2) DEFAULT 0.00,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (real_estate_id) REFERENCES real_estates(id),
    INDEX idx_user_property (user_id, real_estate_id)
);

-- 贷款表
CREATE TABLE loans (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    type ENUM('NORMAL', 'LEVERAGE') NOT NULL,
    principal DECIMAL(15,2) NOT NULL,
    interest_rate DECIMAL(5,4) NOT NULL,
    remaining_amount DECIMAL(15,2) NOT NULL,
    term_weeks INT NOT NULL,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NOT NULL,
    status ENUM('ACTIVE', 'PAID', 'OVERDUE', 'DEFAULTED') DEFAULT 'ACTIVE',
    leverage_multiplier INT DEFAULT 1,
    margin_ratio DECIMAL(5,4) DEFAULT 0.00,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_status (user_id, status)
);

-- 商场商品表
CREATE TABLE mall_items (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category ENUM('BOOST', 'FUNCTIONAL', 'DECORATIVE', 'STRATEGIC') NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency ENUM('GOLD', 'DIAMOND', 'POINT') DEFAULT 'GOLD',
    effect_description TEXT NOT NULL,
    duration_hours INT DEFAULT 0,
    is_limited BOOLEAN DEFAULT FALSE,
    stock_quantity INT DEFAULT -1,
    vip_level_required INT DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_vip_level (vip_level_required)
);

-- 消费记录表
CREATE TABLE consumption_records (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    item_id VARCHAR(36) NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    currency ENUM('GOLD', 'DIAMOND', 'POINT') NOT NULL,
    purchase_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_impulse BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (item_id) REFERENCES mall_items(id),
    INDEX idx_user_time (user_id, purchase_time)
);

-- 随机事件表
CREATE TABLE random_events (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type ENUM('MACRO', 'INDUSTRY', 'COMPANY', 'PERSONAL') NOT NULL,
    description TEXT NOT NULL,
    impact_range ENUM('GLOBAL', 'INDUSTRY', 'SPECIFIC') NOT NULL,
    impact_factor DECIMAL(5,4) NOT NULL,
    duration_days INT DEFAULT 1,
    trigger_probability DECIMAL(5,4) DEFAULT 0.0100,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_probability (trigger_probability)
);

-- 事件触发记录表
CREATE TABLE event_triggers (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NULL,
    trigger_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (event_id) REFERENCES random_events(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_time_active (trigger_time, is_active)
);

-- 班级表
CREATE TABLE classes (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    teacher_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (teacher_id) REFERENCES users(id),
    INDEX idx_teacher (teacher_id)
);

-- 用户成就表
CREATE TABLE user_achievements (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    achievement_type VARCHAR(50) NOT NULL,
    achievement_value DECIMAL(15,2) NOT NULL,
    achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_type (user_id, achievement_type)
);

-- 插入初始数据
-- 插入默认股票数据
INSERT INTO stocks (id, code, name, industry, current_price, previous_close, risk_level, market_cap) VALUES
('stock_001', 'AAPL', '苹果公司', '科技', 175.00, 172.50, 6, 2750000000000.00),
('stock_002', 'MSFT', '微软公司', '科技', 330.00, 328.00, 5, 2450000000000.00),
('stock_003', 'TSLA', '特斯拉', '汽车', 240.00, 235.00, 8, 750000000000.00),
('stock_004', 'NVDA', '英伟达', '半导体', 480.00, 475.00, 7, 1180000000000.00),
('stock_005', 'JPM', '摩根大通', '金融', 155.00, 153.00, 4, 450000000000.00);

-- 插入默认房地产数据
INSERT INTO real_estates (id, city, district, base_price_per_sqm, rent_yield, appreciation_potential, risk_coefficient) VALUES
('prop_001', '北京', '朝阳区', 80000.00, 0.0250, 0.0800, 0.40),
('prop_002', '上海', '浦东新区', 75000.00, 0.0280, 0.0700, 0.35),
('prop_003', '广州', '天河区', 45000.00, 0.0350, 0.0600, 0.45),
('prop_004', '深圳', '南山区', 90000.00, 0.0220, 0.0900, 0.50),
('prop_005', '杭州', '西湖区', 50000.00, 0.0300, 0.0650, 0.38);

-- 插入默认商场商品
INSERT INTO mall_items (id, name, category, price, currency, effect_description, duration_hours, vip_level_required) VALUES
('item_001', '双倍收益药剂', 'BOOST', 500.00, 'GOLD', '使用后2小时内所有投资收益翻倍', 2, 0),
('item_002', '风险透视镜', 'FUNCTIONAL', 1000.00, 'GOLD', '永久提升风险识别能力，降低投资风险', 0, 1),
('item_003', '黄金头像框', 'DECORATIVE', 200.00, 'GOLD', '个性化装饰，提升个人形象', 0, 0),
('item_004', '市场情报文件', 'STRATEGIC', 1500.00, 'DIAMOND', '获取独家市场分析报告，指导投资决策', 0, 2);

-- 插入默认随机事件
INSERT INTO random_events (id, name, type, description, impact_range, impact_factor, duration_days, trigger_probability) VALUES
('event_001', '央行降息', 'MACRO', '央行宣布降息0.25%，市场流动性增加', 'GLOBAL', 0.1500, 3, 0.0050),
('event_002', '科技行业突破', 'INDUSTRY', '人工智能技术取得重大突破', 'INDUSTRY', 0.2000, 5, 0.0030),
('event_003', '公司财报超预期', 'COMPANY', '某公司季度财报远超市场预期', 'SPECIFIC', 0.2500, 2, 0.0080);

-- 创建管理员用户 (密码: admin123)
INSERT INTO users (id, username, email, password, role, level, total_assets, cash_balance, credit_score) VALUES
('admin_001', 'admin', 'admin@financelab.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVmYi', 'ADMIN', 99, 1000000.00, 1000000.00, 100);