package com.financelab.realestateservice.service;

import com.financelab.realestateservice.entity.City;
import com.financelab.realestateservice.entity.Property;
import com.financelab.realestateservice.entity.PropertyPriceHistory;
import com.financelab.realestateservice.repository.CityRepository;
import com.financelab.realestateservice.repository.PropertyPriceHistoryRepository;
import com.financelab.realestateservice.repository.PropertyRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@Slf4j
public class PropertyPriceSimulator {
    
    @Autowired
    private PropertyRepository propertyRepository;
    
    @Autowired
    private CityRepository cityRepository;
    
    @Autowired
    private PropertyPriceHistoryRepository priceHistoryRepository;
    
    private final Random random = new Random();
    
    /**
     * 每小时更新一次房产价格
     */
    @Scheduled(fixedRate = 3600000) // 1小时
    @Transactional
    public void updatePropertyPrices() {
        log.info("开始更新房产市场价格...");
        
        List<Property> properties = propertyRepository.findAll();
        int updatedCount = 0;
        
        for (Property property : properties) {
            if (property.getOwnerId() == null) { // 只更新系统所有的房产
                updatePropertyPrice(property);
                updatedCount++;
            }
        }
        
        log.info("房产市场价格更新完成，共更新 {} 处房产", updatedCount);
    }
    
    /**
     * 手动触发价格更新（用于测试）
     */
    @Transactional
    public void manualPriceUpdate() {
        updatePropertyPrices();
    }
    
    /**
     * 更新单个房产价格
     */
    private void updatePropertyPrice(Property property) {
        try {
            City city = property.getCity();
            if (city == null) return;
            
            BigDecimal currentPrice = property.getCurrentPrice();
            
            // 基础增长：城市增长率
            BigDecimal baseGrowth = city.getGrowthRate()
                    .divide(BigDecimal.valueOf(365 * 24), 6, RoundingMode.HALF_UP); // 年化转为小时
            
            // 随机波动：基于城市波动率
            BigDecimal volatility = city.getPriceVolatility()
                    .multiply(BigDecimal.valueOf(random.nextGaussian() * 0.1));
            
            // 房产特性影响
            BigDecimal propertyFactor = calculatePropertyFactor(property);
            
            // 计算新价格
            BigDecimal priceChange = currentPrice
                    .multiply(baseGrowth.add(volatility).add(propertyFactor))
                    .setScale(2, RoundingMode.HALF_UP);
            
            BigDecimal newPrice = currentPrice.add(priceChange);
            
            // 确保价格不会低于购买价格的80%
            BigDecimal minPrice = property.getPurchasePrice()
                    .multiply(BigDecimal.valueOf(0.8))
                    .setScale(2, RoundingMode.HALF_UP);
            
            if (newPrice.compareTo(minPrice) < 0) {
                newPrice = minPrice;
            }
            
            // 更新房产价格
            property.setCurrentPrice(newPrice);
            propertyRepository.save(property);
            
            // 记录价格历史
            savePriceHistory(property, newPrice, priceChange);
            
        } catch (Exception e) {
            log.error("更新房产价格失败，房产ID: {}", property.getId(), e);
        }
    }
    
    /**
     * 计算房产特性对价格的影响因子
     */
    private BigDecimal calculatePropertyFactor(Property property) {
        BigDecimal factor = BigDecimal.ZERO;
        
        // 房屋状况影响
        if (property.getConditionRating() != null) {
            BigDecimal conditionFactor = BigDecimal.valueOf(property.getConditionRating() - 5)
                    .divide(BigDecimal.valueOf(100), 6, RoundingMode.HALF_UP);
            factor = factor.add(conditionFactor);
        }
        
        // 装修等级影响
        BigDecimal upgradeFactor = BigDecimal.valueOf(property.getUpgradeLevel())
                .divide(BigDecimal.valueOf(100), 6, RoundingMode.HALF_UP);
        factor = factor.add(upgradeFactor);
        
        // 房龄影响（房龄越大，增值越慢）
        if (property.getConstructionYear() != null) {
            int age = LocalDateTime.now().getYear() - property.getConstructionYear();
            BigDecimal ageFactor = BigDecimal.valueOf(Math.max(0, 30 - age))
                    .divide(BigDecimal.valueOf(1000), 6, RoundingMode.HALF_UP);
            factor = factor.add(ageFactor);
        }
        
        return factor;
    }
    
    /**
     * 保存价格历史记录
     */
    private void savePriceHistory(Property property, BigDecimal newPrice, BigDecimal priceChange) {
        PropertyPriceHistory history = new PropertyPriceHistory();
        history.setProperty(property);
        history.setPriceDate(LocalDateTime.now());
        history.setMarketPrice(newPrice);
        history.setPriceChange(priceChange);
        
        if (property.getCurrentPrice().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal changeRate = priceChange
                    .divide(property.getCurrentPrice(), 6, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
            history.setPriceChangeRate(changeRate);
        }
        
        priceHistoryRepository.save(history);
    }
}