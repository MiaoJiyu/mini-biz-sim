package com.financelab.realestateservice.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PropertyTransactionDTO {
    private Long id;
    private PropertyDTO property;
    private String buyerId;
    private String sellerId;
    private String type;
    private BigDecimal transactionPrice;
    private BigDecimal transactionFee;
    private BigDecimal taxAmount;
    private Integer rentalDuration;
    private LocalDateTime rentalStartDate;
    private LocalDateTime rentalEndDate;
    private LocalDateTime transactionDate;
    private String status;
    
    // 计算属性
    private BigDecimal totalAmount;
    private String buyerName;
    private String sellerName;
}