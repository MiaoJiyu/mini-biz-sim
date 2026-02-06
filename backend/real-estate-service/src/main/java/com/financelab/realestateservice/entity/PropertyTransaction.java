package com.financelab.realestateservice.entity;

import lombok.Data;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "property_transactions")
@Data
public class PropertyTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;
    
    @Column(name = "buyer_id", nullable = false)
    private String buyerId;
    
    @Column(name = "seller_id")
    private String sellerId; // 为空表示系统出售
    
    @Column(nullable = false)
    private String type; // PURCHASE, SALE, RENT
    
    @Column(name = "transaction_price", nullable = false)
    private BigDecimal transactionPrice;
    
    @Column(name = "transaction_fee")
    private BigDecimal transactionFee;
    
    @Column(name = "tax_amount")
    private BigDecimal taxAmount;
    
    @Column(name = "rental_duration")
    private Integer rentalDuration; // 租赁时长（月）
    
    @Column(name = "rental_start_date")
    private LocalDateTime rentalStartDate;
    
    @Column(name = "rental_end_date")
    private LocalDateTime rentalEndDate;
    
    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime transactionDate;
    
    @Column(nullable = false)
    private String status; // PENDING, COMPLETED, CANCELLED
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (transactionDate == null) {
            transactionDate = LocalDateTime.now();
        }
    }
}