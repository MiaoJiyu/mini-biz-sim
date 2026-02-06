package com.financelab.bankservice.dto;

import com.financelab.bankservice.entity.BankAccount;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class BankAccountDTO {
    
    private Long id;
    private String userId;
    private String accountNumber;
    private BankAccount.AccountType accountType;
    private BigDecimal balance;
    private BigDecimal availableBalance;
    private BigDecimal interestRate;
    private LocalDateTime createdAt;
    private Boolean isActive;
    
    public BankAccountDTO() {}
    
    public BankAccountDTO(BankAccount account) {
        this.id = account.getId();
        this.userId = account.getUserId();
        this.accountNumber = account.getAccountNumber();
        this.accountType = account.getAccountType();
        this.balance = account.getBalance();
        this.availableBalance = account.getAvailableBalance();
        this.interestRate = account.getInterestRate();
        this.createdAt = account.getCreatedAt();
        this.isActive = account.getIsActive();
    }
}