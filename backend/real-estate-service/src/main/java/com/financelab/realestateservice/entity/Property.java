package com.financelab.realestateservice.entity;

import lombok.Data;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "properties")
@Data
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "city_id", nullable = false)
    private City city;
    
    @Column(nullable = false)
    private String type; // RESIDENTIAL, COMMERCIAL, INDUSTRIAL, LAND
    
    @Column(nullable = false)
    private String location; // 具体位置
    
    @Column(name = "total_area", nullable = false)
    private BigDecimal totalArea; // 总面积（平方米）
    
    @Column(name = "usable_area", nullable = false)
    private BigDecimal usableArea; // 可用面积（平方米）
    
    @Column(name = "purchase_price", nullable = false)
    private BigDecimal purchasePrice; // 购买价格
    
    @Column(name = "current_price", nullable = false)
    private BigDecimal currentPrice; // 当前市场价格
    
    @Column(name = "rental_income")
    private BigDecimal rentalIncome; // 月租金收入
    
    @Column(name = "maintenance_cost")
    private BigDecimal maintenanceCost; // 月维护费用
    
    @Column(name = "property_tax")
    private BigDecimal propertyTax; // 房产税
    
    @Column(name = "construction_year")
    private Integer constructionYear; // 建造年份
    
    @Column(name = "condition_rating")
    private Integer conditionRating; // 房屋状况评分（1-10）
    
    @Column(name = "upgrade_level", nullable = false)
    private Integer upgradeLevel = 0; // 装修等级
    
    @Column(name = "max_upgrade_level", nullable = false)
    private Integer maxUpgradeLevel = 3; // 最大装修等级
    
    @Column(name = "is_for_sale", nullable = false)
    private Boolean isForSale = false; // 是否在售
    
    @Column(name = "is_rented", nullable = false)
    private Boolean isRented = false; // 是否已出租
    
    @Column(name = "owner_id")
    private String ownerId; // 业主ID（为空表示系统所有）
    
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