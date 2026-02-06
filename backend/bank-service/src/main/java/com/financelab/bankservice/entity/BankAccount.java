package com.financelab.bankservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bank_accounts")
@Data
public class BankAccount {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String userId;
    
    @Column(nullable = false, unique = true)
    private String accountNumber;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AccountType accountType;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal balance;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal availableBalance;
    
    @Column(precision = 6, scale = 4)
    private BigDecimal interestRate;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column
    private LocalDateTime updatedAt;
    
    @Column(nullable = false)
    private Boolean isActive;
    
    public enum AccountType {
        SAVINGS,        // 储蓄账户
        CURRENT,        // 活期账户
        FIXED_DEPOSIT,  // 定期存款
        INVESTMENT,     // 投资账户
        CREDIT_CARD     // 信用卡账户
    }
}