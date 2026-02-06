-- 创建事件系统数据库
CREATE DATABASE IF NOT EXISTS financelab_events DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE financelab_events;

-- 事件表
CREATE TABLE IF NOT EXISTS events (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL COMMENT '事件标题',
    description TEXT COMMENT '事件描述',
    type VARCHAR(50) NOT NULL COMMENT '事件类型',
    severity VARCHAR(20) NOT NULL COMMENT '事件严重程度',
    probability INT NOT NULL COMMENT '触发概率(1-100)',
    category VARCHAR(50) NOT NULL COMMENT '事件分类',
    effects JSON COMMENT '事件影响配置',
    active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否启用',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_category (category),
    INDEX idx_active (active),
    INDEX idx_probability (probability)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='事件定义表';

-- 用户事件表
CREATE TABLE IF NOT EXISTS user_events (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    event_id BIGINT NOT NULL COMMENT '事件ID',
    title VARCHAR(100) NOT NULL COMMENT '事件标题',
    description TEXT COMMENT '事件描述',
    type VARCHAR(50) COMMENT '事件类型',
    severity VARCHAR(20) COMMENT '事件严重程度',
    effects JSON COMMENT '事件影响配置',
    triggered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '触发时间',
    resolved_at DATETIME COMMENT '解决时间',
    resolved BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否已解决',
    user_choice TEXT COMMENT '用户选择',
    outcome TEXT COMMENT '处理结果',
    INDEX idx_user_id (user_id),
    INDEX idx_resolved (resolved),
    INDEX idx_triggered_at (triggered_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户事件记录表';

-- 事件选择表
CREATE TABLE IF NOT EXISTS event_choices (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    event_id BIGINT NOT NULL COMMENT '事件ID',
    choice_text VARCHAR(200) NOT NULL COMMENT '选项文本',
    description TEXT COMMENT '选项描述',
    consequences JSON COMMENT '选项后果配置',
    required_level INT NOT NULL DEFAULT 0 COMMENT '所需等级',
    financial_impact DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT '财务影响',
    active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否启用',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_event_id (event_id),
    INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='事件选项表';

-- 插入示例事件
INSERT INTO events (title, description, type, severity, probability, category, effects, active) VALUES
('股市崩盘', '全球股市突然大幅下跌,影响投资者资产', 'MARKET_CRASH', 'HIGH', 5, 'MARKET',
 '{"stockDrop": 20, "panicIndex": 80}', TRUE),
('经济繁荣', '经济指标向好,各行业蓬勃发展', 'ECONOMIC_BOOM', 'MEDIUM', 10, 'MARKET',
 '{"stockRise": 15, "salaryBonus": 0.1}', TRUE),
('利率调整', '央行宣布调整基准利率', 'FINANCIAL_REGULATION', 'LOW', 15, 'MARKET',
 '{"rateChange": 0.0025}', TRUE),
('自然灾害', '发生自然灾害,影响供应链和物价', 'NATURAL_DISASTER', 'CRITICAL', 3, 'SOCIETY',
 '{"inflationRate': 0.05, 'supplyChainDisruption': 30}', TRUE),
('科技突破', '某领域出现重大技术突破', 'TECHNOLOGY_BREAKTHROUGH', 'MEDIUM', 8, 'INDUSTRY',
 '{"techBonus': 5000, 'jobOpportunity': 'AI工程师'}', TRUE),
('公司裁员', '你所在的公司宣布裁员计划', 'NEGATIVE', 'HIGH', 10, 'CAREER',
 '{"salaryCut': 0.2, "unemploymentRisk": 0.5}', TRUE),
('升职加薪', '你的努力得到了认可,获得升职机会', 'POSITIVE', 'MEDIUM', 12, 'CAREER',
 '{"salaryIncrease": 0.15, "levelUp": TRUE}', TRUE),
('房产升值', '你投资的房产价值大幅上升', 'POSITIVE', 'MEDIUM', 15, 'REAL_ESTATE',
 '{"propertyIncrease': 0.1}', TRUE),
('意外之财', '你获得了一笔意外收入', 'POSITIVE', 'LOW', 8, 'FINANCIAL',
 '{"bonus": 10000, "taxFree": TRUE}', TRUE),
('突发疾病', '家庭成员突发疾病需要治疗', 'NEGATIVE', 'HIGH', 5, 'HEALTH',
 '{"medicalCost": 20000, "workDaysLost": 7}', TRUE),
('政策利好', '政府出台新政策支持相关行业', 'POSITIVE', 'LOW', 20, 'SOCIETY',
 '{"subsidy": 5000, "taxRelief": 0.1}', TRUE),
('通货膨胀', '物价持续上涨,购买力下降', 'NEGATIVE', 'MEDIUM', 12, 'SOCIETY',
 '{"inflationRate": 0.03, "realWageDecrease": 0.02}', TRUE);

-- 插入示例事件选项
INSERT INTO event_choices (event_id, choice_text, description, consequences, required_level, financial_impact) VALUES
(1, '紧急抛售', '快速卖出股票止损', '{"stockAction": "SELL", "impact": "MEDIUM"}', 1, -5000.00),
(1, '持有观望', '等待市场反弹', '{"stockAction": "HOLD", "impact": "HIGH"}', 3, 0.00),
(2, '增加投资', '加大投资力度', '{"stockAction": "BUY", "impact": "MEDIUM"}', 2, -10000.00),
(2, '稳健理财', '购买定期存款', '{"bankAction": "DEPOSIT", "impact": "LOW"}', 1, -5000.00),
(5, '学习新技术', '参加培训课程', '{"careerAction": "LEARN", "impact": "HIGH"}', 2, -2000.00),
(5, '观望等待', '继续当前工作', '{"careerAction": "WAIT", "impact": "LOW"}', 1, 0.00),
(6, '积极求职', '寻找新机会', '{"careerAction": "JOB_SEARCH", "impact": "MEDIUM"}', 2, 0.00),
(6, '争取留下', '与公司协商', '{"careerAction": "NEGOTIATE", "impact": "HIGH"}', 3, 0.00),
(10, '立即治疗', '选择优质医疗服务', '{"healthAction": "QUALITY_CARE", "impact": "HIGH"}', 2, -20000.00),
(10, '医保报销', '使用医保降低费用', '{"healthAction": "INSURANCE", "impact": "LOW"}', 1, -5000.00);
