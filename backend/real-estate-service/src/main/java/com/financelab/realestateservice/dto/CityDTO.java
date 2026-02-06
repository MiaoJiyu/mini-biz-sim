package com.financelab.realestateservice.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CityDTO {
    private Long id;
    private String name;
    private String region;
    private BigDecimal basePricePerSqm;
    private BigDecimal priceVolatility;
    private BigDecimal growthRate;
    private Integer populationDensity;
    private Integer economicDevelopmentLevel;
    private Integer infrastructureScore;
    
    // 计算属性
    private BigDecimal averagePropertyPrice;
    private Integer totalProperties;
    private BigDecimal averageRentalYield;
}