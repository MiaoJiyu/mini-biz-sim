package com.financelab.bankservice.dto;

import com.financelab.bankservice.entity.UserInvestment;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class UserInvestmentDTO {
    
    private Long id;
    private String userId;
    private Long productId;
    private String productName;
    private BigDecimal investmentAmount;
    private BigDecimal currentAmount;
    private BigDecimal accumulatedReturn;
    private UserInvestment.InvestmentStatus status;
    private LocalDateTime purchaseDate;
    private LocalDateTime maturityDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public UserInvestmentDTO() {}
    
    public UserInvestmentDTO(UserInvestment investment) {
        this.id = investment.getId();
        this.userId = investment.getUserId();
        this.productId = investment.getProductId();
        this.productName = investment.getProductName();
        this.investmentAmount = investment.getInvestmentAmount();
        this.currentAmount = investment.getCurrentAmount();
        this.accumulatedReturn = investment.getAccumulatedReturn();
        this.status = investment.getStatus();
        this.purchaseDate = investment.getPurchaseDate();
        this.maturityDate = investment.getMaturityDate();
        this.createdAt = investment.getCreatedAt();
        this.updatedAt = investment.getUpdatedAt();
    }
}
