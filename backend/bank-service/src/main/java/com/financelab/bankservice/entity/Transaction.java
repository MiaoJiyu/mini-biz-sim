package com.financelab.bankservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
public class Transaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String fromAccountNumber;
    
    @Column
    private String toAccountNumber;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TransactionType type;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal fee;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal balanceAfter;
    
    @Column(nullable = false)
    private LocalDateTime transactionTime;
    
    @Column
    private String description;
    
    @Column
    private String referenceNumber;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TransactionStatus status;
    
    @Column
    private String failureReason;
    
    public enum TransactionType {
        DEPOSIT,           // 存款
        WITHDRAWAL,        // 取款
        TRANSFER,          // 转账
        LOAN_DISBURSEMENT, // 贷款发放
        LOAN_REPAYMENT,    // 贷款还款
        INTEREST_PAYMENT,  // 利息支付
        FEE_COLLECTION     // 费用收取
    }
    
    public enum TransactionStatus {
        PENDING,           // 处理中
        COMPLETED,         // 已完成
        FAILED,            // 失败
        CANCELLED          // 已取消
    }
}