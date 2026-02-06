package com.financelab.mallservice.dto;

import com.financelab.mallservice.entity.OrderItem;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemDTO {
    
    private Long id;
    private Long orderId;
    private Long productId;
    private String productName;
    private String productCode;
    private String imageUrl;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal totalPrice;
    private String specifications;
    private Product.ProductCategory category;
    
    public OrderItemDTO() {}
    
    public OrderItemDTO(OrderItem item) {
        this.id = item.getId();
        this.orderId = item.getOrderId();
        this.productId = item.getProductId();
        this.productName = item.getProductName();
        this.productCode = item.getProductCode();
        this.imageUrl = item.getImageUrl();
        this.unitPrice = item.getUnitPrice();
        this.quantity = item.getQuantity();
        this.totalPrice = item.getTotalPrice();
        this.specifications = item.getSpecifications();
        this.category = item.getCategory();
    }
}
