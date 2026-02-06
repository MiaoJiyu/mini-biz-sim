package com.financelab.stockservice.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TradeRequestDTO {
    
    private String userId;
    private String stockCode;
    private TradeType tradeType;
    private Integer quantity;
    private BigDecimal price;
    private OrderType orderType;
    
    public enum TradeType {
        BUY, SELL
    }
    
    public enum OrderType {
        MARKET, LIMIT
    }
}