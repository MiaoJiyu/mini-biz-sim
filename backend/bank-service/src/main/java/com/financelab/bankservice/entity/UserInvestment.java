package com.financelab.bankservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_investments")
@Data
public class UserInvestment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String userId;
    
    @Column(nullable = false)
    private Long productId;
    
    @Column(nullable = false)
    private String productName;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal investmentAmount;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal currentAmount;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal accumulatedReturn;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private InvestmentStatus status;
    
    @Column(nullable = false)
    private LocalDateTime purchaseDate;
    
    @Column
    private LocalDateTime maturityDate;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column
    private LocalDateTime updatedAt;
    
    public enum InvestmentStatus {
        ACTIVE,          // 活跃中
        MATURED,         // 已到期
        WITHDRAWN,       // 已赎回
        FORFEITED        // 已放弃
    }
}
