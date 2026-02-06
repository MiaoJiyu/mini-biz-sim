package com.financelab.mallservice.dto;

import com.financelab.mallservice.entity.CartItem;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CartItemDTO {
    
    private Long id;
    private String userId;
    private Long productId;
    private String productName;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal totalPrice;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public CartItemDTO() {}
    
    public CartItemDTO(CartItem item) {
        this.id = item.getId();
        this.userId = item.getUserId();
        this.productId = item.getProductId();
        this.productName = item.getProductName();
        this.unitPrice = item.getUnitPrice();
        this.quantity = item.getQuantity();
        this.totalPrice = item.getTotalPrice();
        this.createdAt = item.getCreatedAt();
        this.updatedAt = item.getUpdatedAt();
    }
}
