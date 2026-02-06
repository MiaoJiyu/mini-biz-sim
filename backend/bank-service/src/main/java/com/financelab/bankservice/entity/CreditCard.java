package com.financelab.bankservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "credit_cards")
@Data
public class CreditCard {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String userId;
    
    @Column(nullable = false, unique = true)
    private String cardNumber;
    
    @Column(nullable = false)
    private String cardHolder;
    
    @Column
    private LocalDate expiryDate;
    
    @Column(nullable = false)
    private Integer cvv;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal creditLimit;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal usedLimit;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal availableLimit;
    
    @Column(nullable = false, precision = 6, scale = 4)
    private BigDecimal interestRate;
    
    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal latePaymentFee;
    
    @Column(nullable = false)
    private LocalDate billingCycleStart;
    
    @Column(nullable = false)
    private LocalDate billingCycleEnd;
    
    @Column(nullable = false)
    private LocalDate paymentDueDate;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal currentBalance;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal minimumPayment;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CardStatus status;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column
    private LocalDateTime updatedAt;
    
    public enum CardStatus {
        ACTIVE,          // 活跃
        FROZEN,          // 冻结
        CANCELLED,       // 已取消
        BLOCKED          // 封锁
    }
}
