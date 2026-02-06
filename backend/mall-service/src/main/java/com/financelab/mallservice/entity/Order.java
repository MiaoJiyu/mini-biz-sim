package com.financelab.mallservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String userId;
    
    @Column(nullable = false, unique = true)
    private String orderNumber;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal totalAmount;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal discountAmount;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal taxAmount;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal shippingAmount;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal finalAmount;
    
    @Column(nullable = false)
    private String shippingAddress;
    
    @Column(nullable = false)
    private String contactPhone;
    
    @Column(nullable = false)
    private String contactName;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;
    
    @Column
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;
    
    @Column
    private LocalDateTime paidAt;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column
    private LocalDateTime shippedAt;
    
    @Column
    private LocalDateTime deliveredAt;
    
    @Column
    private LocalDateTime cancelledAt;
    
    @Column
    private String cancelReason;
    
    @Column
    private String remark;
    
    public enum OrderStatus {
        PENDING,         // 待支付
        PAID,           // 已支付
        PROCESSING,     // 处理中
        SHIPPED,        // 已发货
        DELIVERED,      // 已送达
        COMPLETED,      // 已完成
        CANCELLED,      // 已取消
        REFUNDED        // 已退款
    }
    
    public enum PaymentMethod {
        WALLET,         // 钱包支付
        BANK_CARD,      // 银行卡
        CREDIT_CARD,    // 信用卡
        ONLINE_PAYMENT  // 在线支付
    }
    
    public enum PaymentStatus {
        UNPAID,         // 未支付
        PAYING,         // 支付中
        PAID,           // 已支付
        FAILED,         // 支付失败
        REFUNDING,      // 退款中
        REFUNDED        // 已退款
    }
}
