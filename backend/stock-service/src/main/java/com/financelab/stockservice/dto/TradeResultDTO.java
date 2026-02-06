package com.financelab.stockservice.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TradeResultDTO {
    
    private Long tradeId;
    private String stockCode;
    private String stockName;
    private TradeRequestDTO.TradeType tradeType;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal totalAmount;
    private TradeStatus status;
    private LocalDateTime tradeTime;
    private String message;
    
    public enum TradeStatus {
        SUCCESS, FAILED, PENDING
    }
}