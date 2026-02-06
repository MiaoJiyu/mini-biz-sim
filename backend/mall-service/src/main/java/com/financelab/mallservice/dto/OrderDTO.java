package com.financelab.mallservice.dto;

import com.financelab.mallservice.entity.Order;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDTO {
    
    private Long id;
    private String userId;
    private String orderNumber;
    private Order.OrderStatus status;
    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private BigDecimal taxAmount;
    private BigDecimal shippingAmount;
    private BigDecimal finalAmount;
    private String shippingAddress;
    private String contactPhone;
    private String contactName;
    private Order.PaymentMethod paymentMethod;
    private Order.PaymentStatus paymentStatus;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
    private LocalDateTime shippedAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime cancelledAt;
    private String cancelReason;
    private String remark;
    private List<OrderItemDTO> items;
    
    public OrderDTO() {}
    
    public OrderDTO(Order order) {
        this.id = order.getId();
        this.userId = order.getUserId();
        this.orderNumber = order.getOrderNumber();
        this.status = order.getStatus();
        this.totalAmount = order.getTotalAmount();
        this.discountAmount = order.getDiscountAmount();
        this.taxAmount = order.getTaxAmount();
        this.shippingAmount = order.getShippingAmount();
        this.finalAmount = order.getFinalAmount();
        this.shippingAddress = order.getShippingAddress();
        this.contactPhone = order.getContactPhone();
        this.contactName = order.getContactName();
        this.paymentMethod = order.getPaymentMethod();
        this.paymentStatus = order.getPaymentStatus();
        this.paidAt = order.getPaidAt();
        this.createdAt = order.getCreatedAt();
        this.shippedAt = order.getShippedAt();
        this.deliveredAt = order.getDeliveredAt();
        this.cancelledAt = order.getCancelledAt();
        this.cancelReason = order.getCancelReason();
        this.remark = order.getRemark();
    }
}
