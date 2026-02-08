package com.financelab.stockservice.entity;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_price_history")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StockPriceHistory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_id", nullable = false)
    private Stock stock;
    
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal price;
    
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal volume;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    @Column(nullable = false)
    private PriceType type; // OPEN, CLOSE, HIGH, LOW, TRADE
    
    public enum PriceType {
        OPEN, CLOSE, HIGH, LOW, TRADE
    }
}