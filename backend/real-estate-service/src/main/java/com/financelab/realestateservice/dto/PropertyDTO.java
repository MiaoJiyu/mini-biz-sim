package com.financelab.realestateservice.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PropertyDTO {
    private Long id;
    private String name;
    private CityDTO city;
    private String type;
    private String location;
    private BigDecimal totalArea;
    private BigDecimal usableArea;
    private BigDecimal purchasePrice;
    private BigDecimal currentPrice;
    private BigDecimal rentalIncome;
    private BigDecimal maintenanceCost;
    private BigDecimal propertyTax;
    private Integer constructionYear;
    private Integer conditionRating;
    private Integer upgradeLevel;
    private Integer maxUpgradeLevel;
    private Boolean isForSale;
    private Boolean isRented;
    private String ownerId;
    
    // 计算属性
    private BigDecimal priceChange;
    private BigDecimal priceChangeRate;
    private BigDecimal rentalYield;
    private BigDecimal netMonthlyIncome;
    private BigDecimal annualReturnRate;
    private LocalDateTime lastPriceUpdate;
}