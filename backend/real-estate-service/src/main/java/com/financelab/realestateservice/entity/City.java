package com.financelab.realestateservice.entity;

import lombok.Data;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cities")
@Data
public class City {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String name;
    
    @Column(nullable = false)
    private String region;
    
    @Column(name = "base_price_per_sqm", nullable = false)
    private BigDecimal basePricePerSqm;
    
    @Column(name = "price_volatility", nullable = false)
    private BigDecimal priceVolatility;
    
    @Column(name = "growth_rate", nullable = false)
    private BigDecimal growthRate;
    
    @Column(name = "population_density")
    private Integer populationDensity;
    
    @Column(name = "economic_development_level")
    private Integer economicDevelopmentLevel;
    
    @Column(name = "infrastructure_score")
    private Integer infrastructureScore;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}