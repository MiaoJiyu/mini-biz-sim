package com.financelab.bankservice.dto;

import com.financelab.bankservice.entity.Transaction;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransactionDTO {
    
    private Long id;
    private String fromAccountNumber;
    private String toAccountNumber;
    private Transaction.TransactionType type;
    private BigDecimal amount;
    private BigDecimal fee;
    private BigDecimal balanceAfter;
    private LocalDateTime transactionTime;
    private String description;
    private String referenceNumber;
    private Transaction.TransactionStatus status;
    
    public TransactionDTO() {}
    
    public TransactionDTO(Transaction transaction) {
        this.id = transaction.getId();
        this.fromAccountNumber = transaction.getFromAccountNumber();
        this.toAccountNumber = transaction.getToAccountNumber();
        this.type = transaction.getType();
        this.amount = transaction.getAmount();
        this.fee = transaction.getFee();
        this.balanceAfter = transaction.getBalanceAfter();
        this.transactionTime = transaction.getTransactionTime();
        this.description = transaction.getDescription();
        this.referenceNumber = transaction.getReferenceNumber();
        this.status = transaction.getStatus();
    }
}