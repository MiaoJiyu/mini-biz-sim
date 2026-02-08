package com.financelab.stockservice.entity;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_positions")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserPosition {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String userId; // 用户ID
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_id", nullable = false)
    private Stock stock;
    
    @Column(nullable = false)
    private Integer quantity; // 持仓数量
    
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal averagePrice; // 平均成本价
    
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal currentValue; // 当前市值
    
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal profitLoss; // 浮动盈亏
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime lastUpdated;
    
    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.lastUpdated = LocalDateTime.now();
    }
    
    @PreUpdate
    public void onUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }
}