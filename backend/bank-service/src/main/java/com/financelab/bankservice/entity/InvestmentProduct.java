package com.financelab.bankservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "investment_products")
@Data
public class InvestmentProduct {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String productCode;
    
    @Column(nullable = false)
    private String productName;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ProductType productType;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal minInvestmentAmount;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal maxInvestmentAmount;
    
    @Column(nullable = false, precision = 6, scale = 4)
    private BigDecimal expectedReturnRate;
    
    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal riskLevel;
    
    @Column(nullable = false)
    private Integer termDays;
    
    @Column(nullable = false, precision = 6, scale = 4)
    private BigDecimal earlyWithdrawalPenalty;
    
    @Column(nullable = false)
    private String description;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ProductStatus status;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column
    private LocalDateTime updatedAt;
    
    public enum ProductType {
        FIXED_INCOME,     // 固定收益
        FUND,            // 基金
        STRUCTURED,      // 结构性产品
        HYBRID           // 混合型
    }
    
    public enum ProductStatus {
        AVAILABLE,       // 可购买
        SOLD_OUT,        // 售罄
        SUSPENDED,       // 暂停
        TERMINATED       // 已终止
    }
}
