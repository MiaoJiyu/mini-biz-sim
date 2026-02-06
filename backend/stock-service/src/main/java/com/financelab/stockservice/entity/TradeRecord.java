package com.financelab.stockservice.entity;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "trade_records")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TradeRecord {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String userId; // 用户ID
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_id", nullable = false)
    private Stock stock;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TradeType tradeType; // BUY/SELL
    
    @Column(nullable = false)
    private Integer quantity; // 交易数量
    
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal price; // 交易价格
    
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal totalAmount; // 交易总金额
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderType orderType; // MARKET/LIMIT
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TradeStatus status; // PENDING, COMPLETED, CANCELLED
    
    @Column(nullable = false)
    private LocalDateTime tradeTime;
    
    public enum TradeType {
        BUY, SELL
    }
    
    public enum OrderType {
        MARKET, LIMIT
    }
    
    public enum TradeStatus {
        PENDING, COMPLETED, CANCELLED
    }
    
    @PrePersist
    public void onCreate() {
        if (this.tradeTime == null) {
            this.tradeTime = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = TradeStatus.PENDING;
        }
    }
}