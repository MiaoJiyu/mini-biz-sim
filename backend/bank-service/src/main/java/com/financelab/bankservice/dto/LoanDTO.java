package com.financelab.bankservice.dto;

import com.financelab.bankservice.entity.Loan;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class LoanDTO {
    
    private Long id;
    private String userId;
    private Loan.LoanType loanType;
    private BigDecimal principalAmount;
    private BigDecimal remainingAmount;
    private BigDecimal interestRate;
    private Integer termMonths;
    private Integer remainingMonths;
    private BigDecimal monthlyPayment;
    private Loan.LoanStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime approvedAt;
    private LocalDateTime nextPaymentDate;
    private BigDecimal totalInterestPaid;
    private BigDecimal lateFee;
    private Integer overdueDays;
    
    public LoanDTO() {}
    
    public LoanDTO(Loan loan) {
        this.id = loan.getId();
        this.userId = loan.getUserId();
        this.loanType = loan.getLoanType();
        this.principalAmount = loan.getPrincipalAmount();
        this.remainingAmount = loan.getRemainingAmount();
        this.interestRate = loan.getInterestRate();
        this.termMonths = loan.getTermMonths();
        this.remainingMonths = loan.getRemainingMonths();
        this.monthlyPayment = loan.getMonthlyPayment();
        this.status = loan.getStatus();
        this.createdAt = loan.getCreatedAt();
        this.approvedAt = loan.getApprovedAt();
        this.nextPaymentDate = loan.getNextPaymentDate();
        this.totalInterestPaid = loan.getTotalInterestPaid();
        this.lateFee = loan.getLateFee();
        this.overdueDays = loan.getOverdueDays();
    }
}