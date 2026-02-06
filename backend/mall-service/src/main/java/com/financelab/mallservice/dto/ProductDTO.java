package com.financelab.mallservice.dto;

import com.financelab.mallservice.entity.Product;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ProductDTO {
    
    private Long id;
    private String productCode;
    private String productName;
    private Product.ProductCategory category;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private String imageUrl;
    private Product.ProductStatus status;
    private BigDecimal discount;
    private BigDecimal taxRate;
    private String brand;
    private String specifications;
    private Integer salesCount;
    private Integer rating;
    private Integer reviewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public ProductDTO() {}
    
    public ProductDTO(Product product) {
        this.id = product.getId();
        this.productCode = product.getProductCode();
        this.productName = product.getProductName();
        this.category = product.getCategory();
        this.description = product.getDescription();
        this.price = product.getPrice();
        this.stock = product.getStock();
        this.imageUrl = product.getImageUrl();
        this.status = product.getStatus();
        this.discount = product.getDiscount();
        this.taxRate = product.getTaxRate();
        this.brand = product.getBrand();
        this.specifications = product.getSpecifications();
        this.salesCount = product.getSalesCount();
        this.rating = product.getRating();
        this.reviewCount = product.getReviewCount();
        this.createdAt = product.getCreatedAt();
        this.updatedAt = product.getUpdatedAt();
    }
}
