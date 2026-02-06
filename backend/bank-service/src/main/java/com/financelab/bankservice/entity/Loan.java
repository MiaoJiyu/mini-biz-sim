package com.financelab.bankservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "loans")
@Data
public class Loan {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String userId;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private LoanType loanType;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal principalAmount;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal remainingAmount;
    
    @Column(nullable = false, precision = 6, scale = 4)
    private BigDecimal interestRate;
    
    @Column(nullable = false)
    private Integer termMonths;
    
    @Column(nullable = false)
    private Integer remainingMonths;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal monthlyPayment;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private LoanStatus status;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column
    private LocalDateTime approvedAt;
    
    @Column
    private LocalDateTime nextPaymentDate;
    
    @Column
    private LocalDateTime completedAt;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal totalInterestPaid;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal lateFee;
    
    @Column
    private Integer overdueDays;
    
    public enum LoanType {
        PERSONAL,           // 个人贷款
        BUSINESS,           // 商业贷款
        MORTGAGE,          // 抵押贷款
        LEVERAGE,          // 杠杆贷款
        EDUCATION          // 教育贷款
    }
    
    public enum LoanStatus {
        PENDING,           // 待审核
        APPROVED,          // 已批准
        ACTIVE,            // 活跃中
        DELINQUENT,        // 逾期
        PAID_OFF,          // 已还清
        DEFAULTED,         // 违约
        REJECTED           // 已拒绝
    }
}