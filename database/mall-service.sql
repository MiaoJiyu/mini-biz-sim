-- 商场服务数据库表结构
-- 创建时间: 2026-02-06

-- 创建数据库
CREATE DATABASE IF NOT EXISTS mall_service
DEFAULT CHARACTER SET utf8mb4
DEFAULT COLLATE utf8mb4_unicode_ci;

USE mall_service;

-- 商品表
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_code VARCHAR(50) NOT NULL UNIQUE,
    product_name VARCHAR(200) NOT NULL,
    category VARCHAR(20) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    status VARCHAR(20) NOT NULL,
    discount DECIMAL(6, 2),
    tax_rate DECIMAL(6, 2),
    brand VARCHAR(100),
    specifications TEXT,
    sales_count INT NOT NULL,
    rating INT NOT NULL,
    review_count INT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    INDEX idx_product_code (product_code),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_price (price),
    INDEX idx_sales_count (sales_count),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 购物车表
CREATE TABLE IF NOT EXISTS cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    UNIQUE KEY uk_user_product (user_id, product_id),
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 订单表
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    discount_amount DECIMAL(15, 2) NOT NULL,
    tax_amount DECIMAL(15, 2) NOT NULL,
    shipping_amount DECIMAL(15, 2) NOT NULL,
    final_amount DECIMAL(15, 2) NOT NULL,
    shipping_address TEXT NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    contact_name VARCHAR(100) NOT NULL,
    payment_method VARCHAR(20),
    payment_status VARCHAR(20),
    paid_at DATETIME,
    created_at DATETIME NOT NULL,
    shipped_at DATETIME,
    delivered_at DATETIME,
    cancelled_at DATETIME,
    cancel_reason TEXT,
    remark TEXT,
    INDEX idx_user_id (user_id),
    INDEX idx_order_number (order_number),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_payment_status (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 订单详情表
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    product_code VARCHAR(50) NOT NULL,
    image_url VARCHAR(500),
    unit_price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    specifications TEXT,
    category VARCHAR(20) NOT NULL,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建视图：商品销量统计
CREATE OR REPLACE VIEW v_product_sales_stats AS
SELECT
    p.id,
    p.product_code,
    p.product_name,
    p.category,
    p.price,
    p.stock,
    p.sales_count,
    p.rating,
    p.review_count,
    p.status,
    COALESCE(SUM(oi.quantity), 0) as total_ordered
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id;

-- 创建视图：用户订单统计
CREATE OR REPLACE VIEW v_user_order_stats AS
SELECT
    user_id,
    COUNT(*) as total_orders,
    SUM(CASE WHEN status != 'CANCELLED' AND status != 'REFUNDED' THEN 1 ELSE 0 END) as completed_orders,
    SUM(CASE WHEN status != 'CANCELLED' AND status != 'REFUNDED' THEN final_amount ELSE 0 END) as total_spent,
    SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelled_orders,
    MIN(created_at) as first_order_date,
    MAX(created_at) as last_order_date
FROM orders
GROUP BY user_id;

-- 创建视图：分类商品统计
CREATE OR REPLACE VIEW v_category_stats AS
SELECT
    category,
    COUNT(*) as product_count,
    SUM(stock) as total_stock,
    SUM(sales_count) as total_sales,
    AVG(price) as avg_price,
    AVG(rating) as avg_rating
FROM products
WHERE status = 'AVAILABLE'
GROUP BY category;

-- 创建存储过程：更新商品库存
DELIMITER $$

CREATE PROCEDURE sp_update_product_stock(IN p_product_id BIGINT, IN p_quantity INT, IN p_operation VARCHAR(10))
BEGIN
    IF p_operation = 'decrease' THEN
        UPDATE products
        SET stock = stock - p_quantity,
            sales_count = sales_count + p_quantity
        WHERE id = p_product_id AND stock >= p_quantity;
    ELSEIF p_operation = 'increase' THEN
        UPDATE products
        SET stock = stock + p_quantity,
            sales_count = GREATEST(0, sales_count - p_quantity)
        WHERE id = p_product_id;
    END IF;
END$$

DELIMITER ;

-- 创建存储过程：计算购物车总价
DELIMITER $$

CREATE PROCEDURE sp_calculate_cart_total(IN p_user_id VARCHAR(50), OUT p_total DECIMAL(15, 2))
BEGIN
    SELECT COALESCE(SUM(total_price), 0)
    INTO p_total
    FROM cart_items
    WHERE user_id = p_user_id;
END$$

DELIMITER ;

-- 创建触发器：订单创建后自动扣减库存
DELIMITER $$

CREATE TRIGGER tr_decrease_stock_after_order
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    UPDATE products
    SET stock = stock - NEW.quantity,
        sales_count = sales_count + NEW.quantity
    WHERE id = NEW.product_id;
END$$

DELIMITER ;

-- 创建触发器：订单取消后恢复库存
DELIMITER $$

CREATE TRIGGER tr_restore_stock_on_cancel
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF NEW.status = 'CANCELLED' AND OLD.status != 'CANCELLED' THEN
        UPDATE products p
        INNER JOIN order_items oi ON p.id = oi.product_id
        SET p.stock = p.stock + oi.quantity,
            p.sales_count = GREATEST(0, p.sales_count - oi.quantity)
        WHERE oi.order_id = NEW.id;
    END IF;
END$$

DELIMITER ;

-- 插入初始数据示例（可选）

-- 示例：创建一些测试产品
-- INSERT INTO products (product_code, product_name, category, description, price, stock, image_url, status, discount, tax_rate, brand, specifications, sales_count, rating, review_count, created_at)
-- VALUES
-- ('ELEC001', '智能手机Pro', 'ELECTRONICS', '5.5英寸高清屏幕，8GB内存，256GB存储', 3999.00, 100, 'https://example.com/phone.jpg', 'AVAILABLE', 0.00, 0.13, '科技品牌', '黑色', 100, 48, 50, NOW()),
-- ('CLOTH001', '商务西装', 'CLOTHING', '优质面料，修身剪裁', 899.00, 50, 'https://example.com/suit.jpg', 'AVAILABLE', 0.00, 0.13, '时尚品牌', 'L码，深蓝色', 80, 45, 30, NOW());
