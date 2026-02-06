package com.financelab.bankservice.dto;

import com.financelab.bankservice.entity.InvestmentProduct;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class InvestmentProductDTO {
    
    private Long id;
    private String productCode;
    private String productName;
    private InvestmentProduct.ProductType productType;
    private BigDecimal minInvestmentAmount;
    private BigDecimal maxInvestmentAmount;
    private BigDecimal expectedReturnRate;
    private BigDecimal riskLevel;
    private Integer termDays;
    private BigDecimal earlyWithdrawalPenalty;
    private String description;
    private InvestmentProduct.ProductStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public InvestmentProductDTO() {}
    
    public InvestmentProductDTO(InvestmentProduct product) {
        this.id = product.getId();
        this.productCode = product.getProductCode();
        this.productName = product.getProductName();
        this.productType = product.getProductType();
        this.minInvestmentAmount = product.getMinInvestmentAmount();
        this.maxInvestmentAmount = product.getMaxInvestmentAmount();
        this.expectedReturnRate = product.getExpectedReturnRate();
        this.riskLevel = product.getRiskLevel();
        this.termDays = product.getTermDays();
        this.earlyWithdrawalPenalty = product.getEarlyWithdrawalPenalty();
        this.description = product.getDescription();
        this.status = product.getStatus();
        this.createdAt = product.getCreatedAt();
        this.updatedAt = product.getUpdatedAt();
    }
}
