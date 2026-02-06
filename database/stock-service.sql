-- 财商学堂股票服务数据库初始化脚本
-- 创建股票服务数据库
CREATE DATABASE IF NOT EXISTS financelab_stock CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE financelab_stock;

-- 股票表
CREATE TABLE IF NOT EXISTS stocks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL COMMENT '股票代码',
    name VARCHAR(100) NOT NULL COMMENT '股票名称',
    company VARCHAR(200) NOT NULL COMMENT '公司名称',
    industry VARCHAR(50) NOT NULL COMMENT '行业分类',
    current_price DECIMAL(10,2) NOT NULL COMMENT '当前价格',
    previous_close DECIMAL(10,2) NOT NULL COMMENT '昨日收盘价',
    open_price DECIMAL(10,2) NOT NULL COMMENT '今日开盘价',
    high_price DECIMAL(10,2) NOT NULL COMMENT '今日最高价',
    low_price DECIMAL(10,2) NOT NULL COMMENT '今日最低价',
    volume BIGINT NOT NULL DEFAULT 0 COMMENT '成交量',
    market_cap DECIMAL(15,2) NOT NULL COMMENT '市值',
    volatility INT NOT NULL DEFAULT 5 COMMENT '波动率 (1-10)',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否活跃',
    last_updated DATETIME NOT NULL COMMENT '最后更新时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_industry (industry),
    INDEX idx_active (is_active)
) ENGINE=InnoDB COMMENT='股票基本信息表';

-- 股票价格历史表
CREATE TABLE IF NOT EXISTS stock_price_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    stock_id BIGINT NOT NULL COMMENT '股票ID',
    price DECIMAL(10,2) NOT NULL COMMENT '价格',
    volume DECIMAL(15,2) NOT NULL COMMENT '成交量',
    timestamp DATETIME NOT NULL COMMENT '时间戳',
    type ENUM('OPEN', 'CLOSE', 'HIGH', 'LOW', 'TRADE') NOT NULL COMMENT '价格类型',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE,
    INDEX idx_stock_timestamp (stock_id, timestamp),
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB COMMENT='股票价格历史表';

-- 用户持仓表
CREATE TABLE IF NOT EXISTS user_positions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL COMMENT '用户ID',
    stock_id BIGINT NOT NULL COMMENT '股票ID',
    quantity INT NOT NULL DEFAULT 0 COMMENT '持仓数量',
    average_price DECIMAL(10,2) NOT NULL DEFAULT 0 COMMENT '平均成本价',
    current_value DECIMAL(10,2) NOT NULL DEFAULT 0 COMMENT '当前市值',
    profit_loss DECIMAL(10,2) NOT NULL DEFAULT 0 COMMENT '浮动盈亏',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated DATETIME NOT NULL COMMENT '最后更新时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_stock (user_id, stock_id),
    INDEX idx_user_id (user_id),
    INDEX idx_stock_id (stock_id)
) ENGINE=InnoDB COMMENT='用户持仓表';

-- 交易记录表
CREATE TABLE IF NOT EXISTS trade_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL COMMENT '用户ID',
    stock_id BIGINT NOT NULL COMMENT '股票ID',
    trade_type ENUM('BUY', 'SELL') NOT NULL COMMENT '交易类型',
    quantity INT NOT NULL COMMENT '交易数量',
    price DECIMAL(10,2) NOT NULL COMMENT '交易价格',
    total_amount DECIMAL(10,2) NOT NULL COMMENT '交易总金额',
    order_type ENUM('MARKET', 'LIMIT') NOT NULL COMMENT '订单类型',
    status ENUM('PENDING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING' COMMENT '交易状态',
    trade_time DATETIME NOT NULL COMMENT '交易时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_stock_id (stock_id),
    INDEX idx_trade_time (trade_time),
    INDEX idx_user_trade_time (user_id, trade_time)
) ENGINE=InnoDB COMMENT='交易记录表';

-- 插入初始股票数据
INSERT IGNORE INTO stocks (code, name, company, industry, current_price, previous_close, open_price, high_price, low_price, volume, market_cap, volatility, is_active, last_updated) VALUES
('000001', '平安银行', '平安银行股份有限公司', '金融', 15.50, 15.50, 15.50, 15.80, 15.20, 1000000, 15500000000.00, 5, TRUE, NOW()),
('000002', '万科A', '万科企业股份有限公司', '房地产', 25.80, 25.80, 25.80, 26.50, 25.30, 800000, 25800000000.00, 7, TRUE, NOW()),
('000858', '五粮液', '宜宾五粮液股份有限公司', '消费', 160.45, 160.45, 160.45, 165.20, 158.30, 500000, 160450000000.00, 6, TRUE, NOW()),
('600036', '招商银行', '招商银行股份有限公司', '金融', 35.20, 35.20, 35.20, 36.00, 34.80, 1200000, 35200000000.00, 4, TRUE, NOW()),
('600519', '贵州茅台', '贵州茅台酒股份有限公司', '消费', 1800.00, 1800.00, 1800.00, 1850.00, 1780.00, 200000, 1800000000000.00, 3, TRUE, NOW()),
('601318', '中国平安', '中国平安保险(集团)股份有限公司', '金融', 48.60, 48.60, 48.60, 49.80, 47.90, 900000, 48600000000.00, 5, TRUE, NOW()),
('601888', '中国中免', '中国旅游集团中免股份有限公司', '消费', 95.30, 95.30, 95.30, 98.50, 93.20, 600000, 95300000000.00, 8, TRUE, NOW()),
('603259', '药明康德', '无锡药明康德新药开发股份有限公司', '医药', 75.80, 75.80, 75.80, 78.90, 74.20, 400000, 75800000000.00, 9, TRUE, NOW()),
('300750', '宁德时代', '宁德时代新能源科技股份有限公司', '新能源', 210.50, 210.50, 210.50, 218.00, 205.80, 700000, 210500000000.00, 10, TRUE, NOW()),
('688981', '中芯国际', '中芯国际集成电路制造有限公司', '科技', 45.60, 45.60, 45.60, 47.20, 44.30, 550000, 45600000000.00, 8, TRUE, NOW());

-- 创建视图：股票实时行情视图
CREATE OR REPLACE VIEW stock_quotes AS
SELECT 
    s.code,
    s.name,
    s.company,
    s.industry,
    s.current_price,
    s.previous_close,
    s.current_price - s.previous_close AS change,
    ROUND((s.current_price - s.previous_close) / s.previous_close * 100, 2) AS change_percent,
    s.open_price,
    s.high_price,
    s.low_price,
    s.volume,
    s.market_cap,
    s.is_active
FROM stocks s
WHERE s.is_active = TRUE;

-- 创建存储过程：更新股票价格
DELIMITER //
CREATE PROCEDURE UpdateStockPrice(
    IN p_stock_code VARCHAR(20),
    IN p_new_price DECIMAL(10,2)
)
BEGIN
    DECLARE v_stock_id BIGINT;
    DECLARE v_old_price DECIMAL(10,2);
    
    -- 获取股票ID和原价格
    SELECT id, current_price INTO v_stock_id, v_old_price 
    FROM stocks WHERE code = p_stock_code;
    
    IF v_stock_id IS NOT NULL THEN
        -- 更新股票价格
        UPDATE stocks 
        SET 
            current_price = p_new_price,
            high_price = GREATEST(high_price, p_new_price),
            low_price = LEAST(low_price, p_new_price),
            last_updated = NOW()
        WHERE id = v_stock_id;
        
        -- 记录价格历史
        INSERT INTO stock_price_history (stock_id, price, volume, timestamp, type)
        SELECT 
            v_stock_id, 
            p_new_price, 
            volume, 
            NOW(), 
            'TRADE'
        FROM stocks WHERE id = v_stock_id;
    END IF;
END //
DELIMITER ;

-- 创建存储过程：执行股票交易
DELIMITER //
CREATE PROCEDURE ExecuteStockTrade(
    IN p_user_id VARCHAR(50),
    IN p_stock_code VARCHAR(20),
    IN p_trade_type ENUM('BUY', 'SELL'),
    IN p_quantity INT,
    IN p_price DECIMAL(10,2),
    IN p_order_type ENUM('MARKET', 'LIMIT')
)
BEGIN
    DECLARE v_stock_id BIGINT;
    DECLARE v_total_amount DECIMAL(10,2);
    DECLARE v_existing_quantity INT DEFAULT 0;
    DECLARE v_existing_avg_price DECIMAL(10,2) DEFAULT 0;
    
    -- 获取股票ID
    SELECT id INTO v_stock_id FROM stocks WHERE code = p_stock_code;
    
    IF v_stock_id IS NOT NULL THEN
        -- 计算交易总金额
        SET v_total_amount = p_quantity * p_price;
        
        -- 创建交易记录
        INSERT INTO trade_records (user_id, stock_id, trade_type, quantity, price, total_amount, order_type, status, trade_time)
        VALUES (p_user_id, v_stock_id, p_trade_type, p_quantity, p_price, v_total_amount, p_order_type, 'COMPLETED', NOW());
        
        -- 更新用户持仓
        SELECT quantity, average_price INTO v_existing_quantity, v_existing_avg_price
        FROM user_positions 
        WHERE user_id = p_user_id AND stock_id = v_stock_id;
        
        IF v_existing_quantity IS NULL THEN
            -- 新建持仓记录（买入）
            IF p_trade_type = 'BUY' THEN
                INSERT INTO user_positions (user_id, stock_id, quantity, average_price, current_value, profit_loss, last_updated)
                VALUES (p_user_id, v_stock_id, p_quantity, p_price, p_quantity * p_price, 0, NOW());
            END IF;
        ELSE
            -- 更新现有持仓
            IF p_trade_type = 'BUY' THEN
                -- 买入：计算新的平均成本
                UPDATE user_positions 
                SET 
                    quantity = quantity + p_quantity,
                    average_price = (average_price * quantity + p_price * p_quantity) / (quantity + p_quantity),
                    last_updated = NOW()
                WHERE user_id = p_user_id AND stock_id = v_stock_id;
            ELSE
                -- 卖出：检查持仓是否足够
                IF v_existing_quantity >= p_quantity THEN
                    UPDATE user_positions 
                    SET 
                        quantity = quantity - p_quantity,
                        last_updated = NOW()
                    WHERE user_id = p_user_id AND stock_id = v_stock_id;
                ELSE
                    -- 持仓不足，抛出错误（实际应用中应回滚事务）
                    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '持仓数量不足';
                END IF;
            END IF;
        END IF;
        
        -- 更新持仓的当前市值和盈亏
        UPDATE user_positions up
        JOIN stocks s ON up.stock_id = s.id
        SET 
            up.current_value = up.quantity * s.current_price,
            up.profit_loss = up.quantity * (s.current_price - up.average_price),
            up.last_updated = NOW()
        WHERE up.user_id = p_user_id AND up.stock_id = v_stock_id;
        
    END IF;
END //
DELIMITER ;

-- 创建索引以优化查询性能
CREATE INDEX idx_stock_price_history_stock_id ON stock_price_history(stock_id);
CREATE INDEX idx_trade_records_user_time ON trade_records(user_id, trade_time);
CREATE INDEX idx_user_positions_user_stock ON user_positions(user_id, stock_id);

COMMIT;

-- 完成提示
SELECT '股票服务数据库初始化完成！' AS message;