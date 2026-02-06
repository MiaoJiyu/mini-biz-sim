package com.financelab.realestateservice.entity;

import lombok.Data;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "property_price_history")
@Data
public class PropertyPriceHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;
    
    @Column(name = "price_date", nullable = false)
    private LocalDateTime priceDate;
    
    @Column(name = "market_price", nullable = false)
    private BigDecimal marketPrice;
    
    @Column(name = "price_change")
    private BigDecimal priceChange;
    
    @Column(name = "price_change_rate")
    private BigDecimal priceChangeRate;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (priceDate == null) {
            priceDate = LocalDateTime.now();
        }
    }
}