package com.financelab.bankservice.dto;

import com.financelab.bankservice.entity.CreditCard;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class CreditCardDTO {
    
    private Long id;
    private String userId;
    private String cardNumber;
    private String cardHolder;
    private LocalDate expiryDate;
    private Integer cvv;
    private BigDecimal creditLimit;
    private BigDecimal usedLimit;
    private BigDecimal availableLimit;
    private BigDecimal interestRate;
    private BigDecimal latePaymentFee;
    private LocalDate billingCycleStart;
    private LocalDate billingCycleEnd;
    private LocalDate paymentDueDate;
    private BigDecimal currentBalance;
    private BigDecimal minimumPayment;
    private CreditCard.CardStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public CreditCardDTO() {}
    
    public CreditCardDTO(CreditCard card) {
        this.id = card.getId();
        this.userId = card.getUserId();
        this.cardNumber = card.getCardNumber();
        this.cardHolder = card.getCardHolder();
        this.expiryDate = card.getExpiryDate();
        this.cvv = card.getCvv();
        this.creditLimit = card.getCreditLimit();
        this.usedLimit = card.getUsedLimit();
        this.availableLimit = card.getAvailableLimit();
        this.interestRate = card.getInterestRate();
        this.latePaymentFee = card.getLatePaymentFee();
        this.billingCycleStart = card.getBillingCycleStart();
        this.billingCycleEnd = card.getBillingCycleEnd();
        this.paymentDueDate = card.getPaymentDueDate();
        this.currentBalance = card.getCurrentBalance();
        this.minimumPayment = card.getMinimumPayment();
        this.status = card.getStatus();
        this.createdAt = card.getCreatedAt();
        this.updatedAt = card.getUpdatedAt();
    }
}
