package com.financelab.mallservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String productCode;
    
    @Column(nullable = false)
    private String productName;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ProductCategory category;
    
    @Column(nullable = false)
    private String description;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(nullable = false)
    private Integer stock;
    
    @Column(nullable = false)
    private String imageUrl;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ProductStatus status;
    
    @Column(precision = 6, scale = 2)
    private BigDecimal discount;
    
    @Column(precision = 6, scale = 2)
    private BigDecimal taxRate;
    
    @Column
    private String brand;
    
    @Column
    private String specifications;
    
    @Column(nullable = false)
    private Integer salesCount;
    
    @Column(nullable = false)
    private Integer rating;
    
    @Column(nullable = false)
    private Integer reviewCount;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column
    private LocalDateTime updatedAt;
    
    public enum ProductCategory {
        ELECTRONICS,     // 电子产品
        CLOTHING,        // 服装
        FOOD,           // 食品
        HOME,           // 家居
        BOOKS,          // 书籍
        TOYS,           // 玩具
        SPORTS,         // 运动
        BEAUTY,         // 美妆
        LUXURY,         // 奢侈品
        DIGITAL         // 数码
    }
    
    public enum ProductStatus {
        AVAILABLE,      // 可购买
        OUT_OF_STOCK,   // 缺货
        DISCONTINUED,   // 已下架
        COMING_SOON     // 即将上架
    }
}
