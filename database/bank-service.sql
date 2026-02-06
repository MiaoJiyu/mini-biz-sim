-- 银行服务数据库表结构
-- 创建时间: 2026-02-06

-- 创建数据库
CREATE DATABASE IF NOT EXISTS bank_service
DEFAULT CHARACTER SET utf8mb4
DEFAULT COLLATE utf8mb4_unicode_ci;

USE bank_service;

-- 银行账户表
CREATE TABLE IF NOT EXISTS bank_accounts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    account_number VARCHAR(20) NOT NULL UNIQUE,
    account_type VARCHAR(20) NOT NULL,
    balance DECIMAL(15, 2) NOT NULL,
    available_balance DECIMAL(15, 2) NOT NULL,
    interest_rate DECIMAL(6, 4),
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    is_active BOOLEAN NOT NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_account_number (account_number),
    INDEX idx_account_type (account_type),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 信用评分表
CREATE TABLE IF NOT EXISTS credit_scores (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL UNIQUE,
    score INT NOT NULL,
    rating VARCHAR(20) NOT NULL,
    last_updated DATETIME NOT NULL,
    factors TEXT,
    payment_history INT,
    credit_utilization INT,
    credit_age INT,
    credit_mix INT,
    new_credit INT,
    INDEX idx_user_id (user_id),
    INDEX idx_score (score),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 贷款表
CREATE TABLE IF NOT EXISTS loans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    loan_type VARCHAR(20) NOT NULL,
    principal_amount DECIMAL(15, 2) NOT NULL,
    remaining_amount DECIMAL(15, 2) NOT NULL,
    interest_rate DECIMAL(6, 4) NOT NULL,
    term_months INT NOT NULL,
    remaining_months INT NOT NULL,
    monthly_payment DECIMAL(15, 2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at DATETIME NOT NULL,
    approved_at DATETIME,
    next_payment_date DATETIME,
    completed_at DATETIME,
    total_interest_paid DECIMAL(15, 2),
    late_fee DECIMAL(15, 2),
    overdue_days INT,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_loan_type (loan_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 交易记录表
CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    from_account_number VARCHAR(20) NOT NULL,
    to_account_number VARCHAR(20),
    type VARCHAR(30) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    fee DECIMAL(15, 2),
    balance_after DECIMAL(15, 2) NOT NULL,
    transaction_time DATETIME NOT NULL,
    description TEXT,
    reference_number VARCHAR(50),
    status VARCHAR(20) NOT NULL,
    failure_reason TEXT,
    INDEX idx_from_account (from_account_number),
    INDEX idx_to_account (to_account_number),
    INDEX idx_type (type),
    INDEX idx_transaction_time (transaction_time),
    INDEX idx_status (status),
    INDEX idx_reference_number (reference_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 信用卡表
CREATE TABLE IF NOT EXISTS credit_cards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    card_number VARCHAR(20) NOT NULL UNIQUE,
    card_holder VARCHAR(100) NOT NULL,
    expiry_date DATE NOT NULL,
    cvv INT NOT NULL,
    credit_limit DECIMAL(15, 2) NOT NULL,
    used_limit DECIMAL(15, 2) NOT NULL,
    available_limit DECIMAL(15, 2) NOT NULL,
    interest_rate DECIMAL(6, 4) NOT NULL,
    late_payment_fee DECIMAL(6, 2) NOT NULL,
    billing_cycle_start DATE NOT NULL,
    billing_cycle_end DATE NOT NULL,
    payment_due_date DATE NOT NULL,
    current_balance DECIMAL(15, 2) NOT NULL,
    minimum_payment DECIMAL(15, 2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    INDEX idx_user_id (user_id),
    INDEX idx_card_number (card_number),
    INDEX idx_status (status),
    INDEX idx_payment_due_date (payment_due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 理财产品表
CREATE TABLE IF NOT EXISTS investment_products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_code VARCHAR(20) NOT NULL UNIQUE,
    product_name VARCHAR(100) NOT NULL,
    product_type VARCHAR(20) NOT NULL,
    min_investment_amount DECIMAL(15, 2) NOT NULL,
    max_investment_amount DECIMAL(15, 2) NOT NULL,
    expected_return_rate DECIMAL(6, 4) NOT NULL,
    risk_level DECIMAL(6, 2) NOT NULL,
    term_days INT NOT NULL,
    early_withdrawal_penalty DECIMAL(6, 4) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    INDEX idx_product_code (product_code),
    INDEX idx_product_type (product_type),
    INDEX idx_status (status),
    INDEX idx_expected_return_rate (expected_return_rate),
    INDEX idx_risk_level (risk_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 用户投资记录表
CREATE TABLE IF NOT EXISTS user_investments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    investment_amount DECIMAL(15, 2) NOT NULL,
    current_amount DECIMAL(15, 2) NOT NULL,
    accumulated_return DECIMAL(15, 2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    purchase_date DATETIME NOT NULL,
    maturity_date DATETIME,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id),
    INDEX idx_status (status),
    INDEX idx_purchase_date (purchase_date),
    INDEX idx_maturity_date (maturity_date),
    INDEX idx_user_product (user_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建视图：用户账户概览
CREATE OR REPLACE VIEW v_user_account_summary AS
SELECT
    user_id,
    COUNT(*) as account_count,
    SUM(CASE WHEN account_type = 'SAVINGS' THEN balance ELSE 0 END) as savings_balance,
    SUM(CASE WHEN account_type = 'CURRENT' THEN balance ELSE 0 END) as current_balance,
    SUM(CASE WHEN account_type = 'FIXED_DEPOSIT' THEN balance ELSE 0 END) as fixed_deposit_balance,
    SUM(CASE WHEN account_type = 'INVESTMENT' THEN balance ELSE 0 END) as investment_balance,
    SUM(balance) as total_balance
FROM bank_accounts
WHERE is_active = TRUE
GROUP BY user_id;

-- 创建视图：用户贷款概览
CREATE OR REPLACE VIEW v_user_loan_summary AS
SELECT
    user_id,
    COUNT(*) as loan_count,
    SUM(CASE WHEN status = 'ACTIVE' THEN remaining_amount ELSE 0 END) as active_loan_amount,
    SUM(CASE WHEN status = 'PAID_OFF' THEN principal_amount ELSE 0 END) as paid_off_amount,
    SUM(CASE WHEN status = 'DELINQUENT' THEN remaining_amount ELSE 0 END) as overdue_amount,
    SUM(principal_amount) as total_loan_amount,
    SUM(total_interest_paid) as total_interest_paid
FROM loans
GROUP BY user_id;

-- 创建视图：用户投资概览
CREATE OR REPLACE VIEW v_user_investment_summary AS
SELECT
    user_id,
    COUNT(*) as investment_count,
    SUM(CASE WHEN status = 'ACTIVE' THEN investment_amount ELSE 0 END) as active_investment_amount,
    SUM(accumulated_return) as total_return,
    SUM(current_amount) as current_total_amount
FROM user_investments
GROUP BY user_id;

-- 创建存储过程：计算并更新投资收益
DELIMITER $$

CREATE PROCEDURE sp_calculate_investment_returns()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_id BIGINT;
    DECLARE v_investment_amount DECIMAL(15, 2);
    DECLARE v_product_id BIGINT;
    DECLARE v_purchase_date DATETIME;
    DECLARE v_expected_return_rate DECIMAL(6, 4);
    DECLARE v_term_days INT;
    DECLARE days_elapsed INT;
    DECLARE daily_return DECIMAL(15, 2);
    DECLARE new_return DECIMAL(15, 2);
    DECLARE new_amount DECIMAL(15, 2);
    
    DECLARE cur CURSOR FOR
        SELECT 
            id, investment_amount, product_id, purchase_date
        FROM user_investments
        WHERE status = 'ACTIVE';
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur;
    
    read_loop: LOOP
        FETCH cur INTO v_id, v_investment_amount, v_product_id, v_purchase_date;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- 获取产品信息
        SELECT 
            expected_return_rate, term_days
        INTO v_expected_return_rate, v_term_days
        FROM investment_products
        WHERE id = v_product_id;
        
        -- 计算已过天数
        SET days_elapsed = DATEDIFF(NOW(), v_purchase_date);
        
        IF days_elapsed > 0 AND days_elapsed <= v_term_days THEN
            -- 计算日收益率
            SET daily_return = (v_investment_amount * v_expected_return_rate) / (100 * v_term_days);
            
            -- 计算累积收益
            SET new_return = daily_return * days_elapsed;
            
            -- 更新投资记录
            UPDATE user_investments
            SET 
                current_amount = investment_amount + new_return,
                accumulated_return = new_return
            WHERE id = v_id;
        END IF;
    END LOOP;
    
    CLOSE cur;
END$$

DELIMITER ;

-- 创建存储过程：更新信用卡账单周期
DELIMITER $$

CREATE PROCEDURE sp_update_credit_card_billing_cycle()
BEGIN
    UPDATE credit_cards
    SET
        billing_cycle_start = billing_cycle_end,
        billing_cycle_end = DATE_ADD(billing_cycle_end, INTERVAL 30 DAY),
        payment_due_date = DATE_ADD(billing_cycle_end, INTERVAL 15 DAY),
        minimum_payment = current_balance * 0.05
    WHERE 
        CURDATE() >= billing_cycle_end
        AND status = 'ACTIVE';
END$$

DELIMITER ;

-- 创建存储过程：检查逾期贷款
DELIMITER $$

CREATE PROCEDURE sp_check_overdue_loans()
BEGIN
    UPDATE loans
    SET
        status = 'DELINQUENT',
        overdue_days = DATEDIFF(CURDATE(), next_payment_date)
    WHERE
        status = 'ACTIVE'
        AND next_payment_date < CURDATE()
        AND remaining_amount > 0;
END$$

DELIMITER ;

-- 创建触发器：在创建账户时自动初始化信用评分
DELIMITER $$

CREATE TRIGGER tr_init_credit_score_after_account
AFTER INSERT ON bank_accounts
FOR EACH ROW
BEGIN
    DECLARE v_count INT;
    
    -- 检查用户是否已有信用评分
    SELECT COUNT(*) INTO v_count
    FROM credit_scores
    WHERE user_id = NEW.user_id;
    
    -- 如果没有，创建初始信用评分
    IF v_count = 0 THEN
        INSERT INTO credit_scores (user_id, score, rating, last_updated)
        VALUES (NEW.user_id, 650, 'FAIR', NOW());
    END IF;
END$$

DELIMITER ;

-- 插入初始数据示例（可选）

-- 示例：创建一些测试用户账户
-- INSERT INTO bank_accounts (user_id, account_number, account_type, balance, available_balance, interest_rate, created_at, is_active)
-- VALUES
-- ('user001', '6212345678901234', 'SAVINGS', 100000.00, 100000.00, 1.5, NOW(), TRUE),
-- ('user001', '6212345678901235', 'CURRENT', 50000.00, 50000.00, 0.3, NOW(), TRUE);

-- 示例：创建测试信用卡
-- INSERT INTO credit_cards (user_id, card_number, card_holder, expiry_date, cvv, credit_limit, used_limit, available_limit, interest_rate, late_payment_fee, billing_cycle_start, billing_cycle_end, payment_due_date, current_balance, minimum_payment, status, created_at)
-- VALUES
-- ('user001', '4123456789012345', '张三', DATE_ADD(NOW(), INTERVAL 3 YEAR), 123, 50000.00, 0.00, 50000.00, 18.0, 50.0, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), DATE_ADD(CURDATE(), INTERVAL 45 DAY), 0.00, 0.00, 'ACTIVE', NOW());
