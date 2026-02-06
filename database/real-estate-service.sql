-- 财商学堂FinanceLab - 房地产服务数据库表结构
-- 创建数据库
CREATE DATABASE IF NOT EXISTS financelab_realestate CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE financelab_realestate;

-- 城市表
CREATE TABLE cities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    region VARCHAR(50) NOT NULL,
    base_price_per_sqm DECIMAL(15,2) NOT NULL,
    price_volatility DECIMAL(5,4) NOT NULL,
    growth_rate DECIMAL(5,4) NOT NULL,
    population_density INT,
    economic_development_level INT,
    infrastructure_score INT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX idx_region (region),
    INDEX idx_growth_rate (growth_rate DESC),
    INDEX idx_economic_level (economic_development_level DESC)
);

-- 房产表
CREATE TABLE properties (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    city_id BIGINT NOT NULL,
    type ENUM('RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'LAND') NOT NULL,
    location VARCHAR(300) NOT NULL,
    total_area DECIMAL(10,2) NOT NULL,
    usable_area DECIMAL(10,2) NOT NULL,
    purchase_price DECIMAL(15,2) NOT NULL,
    current_price DECIMAL(15,2) NOT NULL,
    rental_income DECIMAL(15,2),
    maintenance_cost DECIMAL(15,2),
    property_tax DECIMAL(15,2),
    construction_year INT,
    condition_rating INT CHECK (condition_rating BETWEEN 1 AND 10),
    upgrade_level INT DEFAULT 0,
    max_upgrade_level INT DEFAULT 3,
    is_for_sale BOOLEAN DEFAULT FALSE,
    is_rented BOOLEAN DEFAULT FALSE,
    owner_id VARCHAR(100),
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE,
    INDEX idx_city_id (city_id),
    INDEX idx_type (type),
    INDEX idx_is_for_sale (is_for_sale),
    INDEX idx_owner_id (owner_id),
    INDEX idx_current_price (current_price),
    INDEX idx_city_for_sale (city_id, is_for_sale)
);

-- 房产价格历史表
CREATE TABLE property_price_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT NOT NULL,
    price_date DATETIME NOT NULL,
    market_price DECIMAL(15,2) NOT NULL,
    price_change DECIMAL(15,2),
    price_change_rate DECIMAL(8,4),
    created_at DATETIME NOT NULL,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    INDEX idx_property_id (property_id),
    INDEX idx_price_date (price_date DESC),
    INDEX idx_property_date (property_id, price_date DESC)
);

-- 房产交易记录表
CREATE TABLE property_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT NOT NULL,
    buyer_id VARCHAR(100) NOT NULL,
    seller_id VARCHAR(100),
    type ENUM('PURCHASE', 'SALE', 'RENT', 'RENT_CANCELLATION') NOT NULL,
    transaction_price DECIMAL(15,2) NOT NULL,
    transaction_fee DECIMAL(15,2),
    tax_amount DECIMAL(15,2),
    rental_duration INT,
    rental_start_date DATETIME,
    rental_end_date DATETIME,
    transaction_date DATETIME NOT NULL,
    status ENUM('PENDING', 'COMPLETED', 'CANCELLED') NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    INDEX idx_buyer_id (buyer_id),
    INDEX idx_seller_id (seller_id),
    INDEX idx_property_id (property_id),
    INDEX idx_transaction_date (transaction_date DESC),
    INDEX idx_user_transactions (buyer_id, transaction_date DESC),
    INDEX idx_type_status (type, status)
);

-- 创建存储过程：计算城市平均房价
DELIMITER //
CREATE PROCEDURE CalculateCityAveragePrice(IN city_id_param BIGINT)
BEGIN
    SELECT 
        c.name AS city_name,
        COUNT(p.id) AS property_count,
        AVG(p.current_price) AS average_price,
        AVG(p.rental_income) AS average_rental_income,
        AVG(p.rental_income * 12 / p.current_price * 100) AS average_yield
    FROM properties p
    JOIN cities c ON p.city_id = c.id
    WHERE c.id = city_id_param
    GROUP BY c.id, c.name;
END //
DELIMITER ;

-- 创建存储过程：获取用户资产统计
DELIMITER //
CREATE PROCEDURE GetUserPortfolioStats(IN user_id_param VARCHAR(100))
BEGIN
    SELECT 
        COUNT(*) AS total_properties,
        SUM(current_price) AS total_value,
        SUM(purchase_price) AS total_cost,
        SUM(rental_income) AS monthly_income,
        SUM(maintenance_cost + property_tax) AS monthly_expenses,
        SUM(CASE WHEN is_rented THEN 1 ELSE 0 END) AS rented_properties
    FROM properties 
    WHERE owner_id = user_id_param;
END //
DELIMITER ;

-- 创建视图：城市房产统计视图
CREATE VIEW city_property_stats AS
SELECT 
    c.id AS city_id,
    c.name AS city_name,
    c.region,
    COUNT(p.id) AS total_properties,
    AVG(p.current_price) AS average_price,
    AVG(p.rental_income) AS average_rental_income,
    AVG(p.rental_income * 12 / p.current_price * 100) AS average_yield,
    COUNT(CASE WHEN p.is_for_sale THEN 1 END) AS properties_for_sale
FROM cities c
LEFT JOIN properties p ON c.id = p.city_id
GROUP BY c.id, c.name, c.region
ORDER BY c.growth_rate DESC;

-- 创建视图：用户交易历史视图
CREATE VIEW user_transaction_history AS
SELECT 
    t.*,
    p.name AS property_name,
    p.type AS property_type,
    c.name AS city_name,
    (t.transaction_price + COALESCE(t.transaction_fee, 0) + COALESCE(t.tax_amount, 0)) AS total_amount
FROM property_transactions t
JOIN properties p ON t.property_id = p.id
JOIN cities c ON p.city_id = c.id
WHERE t.status = 'COMPLETED'
ORDER BY t.transaction_date DESC;

-- 插入初始城市数据
INSERT INTO cities (name, region, base_price_per_sqm, price_volatility, growth_rate, population_density, economic_development_level, infrastructure_score, created_at, updated_at) VALUES
('北京', '华北', 80000.00, 0.1500, 0.0800, 2100, 9, 9, NOW(), NOW()),
('上海', '华东', 75000.00, 0.1200, 0.0700, 2400, 9, 9, NOW(), NOW()),
('深圳', '华南', 70000.00, 0.1800, 0.0900, 1800, 8, 8, NOW(), NOW()),
('广州', '华南', 45000.00, 0.1000, 0.0600, 1500, 8, 8, NOW(), NOW()),
('杭州', '华东', 40000.00, 0.1400, 0.0800, 1200, 7, 7, NOW(), NOW()),
('成都', '西南', 25000.00, 0.0800, 0.0500, 1000, 7, 7, NOW(), NOW()),
('重庆', '西南', 18000.00, 0.0700, 0.0400, 800, 6, 6, NOW(), NOW()),
('武汉', '华中', 22000.00, 0.0900, 0.0500, 900, 6, 6, NOW(), NOW()),
('西安', '西北', 15000.00, 0.0600, 0.0300, 700, 5, 5, NOW(), NOW()),
('沈阳', '东北', 12000.00, 0.0500, 0.0200, 600, 5, 5, NOW(), NOW());

-- 插入初始房产数据（为每个城市插入6处房产）
INSERT INTO properties (name, city_id, type, location, total_area, usable_area, purchase_price, current_price, rental_income, maintenance_cost, property_tax, construction_year, condition_rating, is_for_sale, created_at, updated_at)
SELECT 
    CONCAT(c.name, ' - ', pt.name) AS name,
    c.id AS city_id,
    pt.type,
    pt.location,
    pt.total_area,
    pt.usable_area,
    pt.purchase_price,
    pt.current_price,
    pt.rental_income,
    pt.maintenance_cost,
    pt.property_tax,
    pt.construction_year,
    pt.condition_rating,
    TRUE AS is_for_sale,
    NOW() AS created_at,
    NOW() AS updated_at
FROM cities c
CROSS JOIN (
    SELECT '豪华公寓' AS name, 'RESIDENTIAL' AS type, '市中心黄金地段' AS location, 120.00 AS total_area, 100.00 AS usable_area, 10000000.00 AS purchase_price, 11000000.00 AS current_price, 15000.00 AS rental_income, 3000.00 AS maintenance_cost, 833.33 AS property_tax, 2020 AS construction_year, 8 AS condition_rating
    UNION SELECT '写字楼', 'COMMERCIAL', '商务区核心位置', 500.00, 450.00, 30000000.00, 33000000.00, 50000.00, 10000.00, 2500.00, 2018, 7
    UNION SELECT '商铺', 'COMMERCIAL', '商业街临街位置', 80.00, 70.00, 6000000.00, 6600000.00, 10000.00, 2000.00, 500.00, 2015, 6
    UNION SELECT '别墅', 'RESIDENTIAL', '郊区高档社区', 300.00, 250.00, 20000000.00, 22000000.00, 25000.00, 5000.00, 1666.67, 2019, 9
    UNION SELECT '工业厂房', 'INDUSTRIAL', '工业园区内', 1000.00, 800.00, 15000000.00, 16500000.00, 20000.00, 4000.00, 1250.00, 2010, 5
    UNION SELECT '土地', 'LAND', '城市发展新区', 5000.00, 5000.00, 50000000.00, 55000000.00, 0.00, 0.00, 4166.67, NULL, 10
) pt
ORDER BY c.id;

-- 为部分房产创建价格历史记录
INSERT INTO property_price_history (property_id, price_date, market_price, price_change, price_change_rate, created_at)
SELECT 
    p.id AS property_id,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 30) DAY) AS price_date,
    p.current_price * (0.9 + RAND() * 0.2) AS market_price,
    (p.current_price * (0.9 + RAND() * 0.2) - p.current_price) AS price_change,
    ((p.current_price * (0.9 + RAND() * 0.2) - p.current_price) / p.current_price * 100) AS price_change_rate,
    NOW() AS created_at
FROM properties p
WHERE RAND() < 0.3; -- 为30%的房产创建历史价格记录

-- 创建索引优化查询性能
CREATE INDEX idx_cities_growth_region ON cities(growth_rate DESC, region);
CREATE INDEX idx_properties_price_city ON properties(current_price DESC, city_id);
CREATE INDEX idx_transactions_buyer_date ON property_transactions(buyer_id, transaction_date DESC);
CREATE INDEX idx_price_history_property_date ON property_price_history(property_id, price_date DESC);

-- 创建用户权限（如果需要）
-- GRANT SELECT, INSERT, UPDATE, DELETE ON financelab_realestate.* TO 'financelab_user'@'localhost' IDENTIFIED BY 'password';

-- 显示表结构信息
SHOW TABLES;

-- 显示各表数据量
SELECT 
    'cities' AS table_name, 
    COUNT(*) AS record_count 
FROM cities
UNION ALL
SELECT 
    'properties', 
    COUNT(*) 
FROM properties
UNION ALL
SELECT 
    'property_price_history', 
    COUNT(*) 
FROM property_price_history
UNION ALL
SELECT 
    'property_transactions', 
    COUNT(*) 
FROM property_transactions;