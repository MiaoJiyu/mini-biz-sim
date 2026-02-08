package com.financelab.stockservice.entity;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "stocks")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Stock {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String code; // 股票代码
    
    @Column(nullable = false)
    private String name; // 股票名称
    
    @Column(nullable = false)
    private String company; // 公司名称
    
    @Column(nullable = false)
    private String industry; // 行业分类
    
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal currentPrice; // 当前价格
    
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal previousClose; // 昨日收盘价
    
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal openPrice; // 今日开盘价
    
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal highPrice; // 今日最高价
    
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal lowPrice; // 今日最低价
    
    @Column(nullable = false)
    private Long volume; // 成交量
    
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal marketCap; // 市值
    
    @Column(nullable = false)
    private Integer volatility; // 波动率 (1-10)
    
    @Column(nullable = false)
    private Boolean isActive = true; // 是否活跃
    
    @Column(nullable = false)
    private LocalDateTime lastUpdated;
    
    @PrePersist
    @PreUpdate
    public void updateTimestamp() {
        this.lastUpdated = LocalDateTime.now();
    }
}