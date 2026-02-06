package com.financelab.bankservice.dto;

import com.financelab.bankservice.entity.Loan;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class LoanApplicationDTO {
    
    private String userId;
    private Loan.LoanType loanType;
    private BigDecimal amount;
    private BigDecimal interestRate;
    private Integer termMonths;
    private String purpose;
    
    public LoanApplicationDTO() {}
    
    public LoanApplicationDTO(String userId, Loan.LoanType loanType, BigDecimal amount, 
                             BigDecimal interestRate, Integer termMonths, String purpose) {
        this.userId = userId;
        this.loanType = loanType;
        this.amount = amount;
        this.interestRate = interestRate;
        this.termMonths = termMonths;
        this.purpose = purpose;
    }
}