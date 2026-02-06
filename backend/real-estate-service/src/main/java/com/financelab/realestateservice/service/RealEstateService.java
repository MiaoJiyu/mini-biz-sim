package com.financelab.realestateservice.service;

import com.financelab.realestateservice.dto.PropertyDTO;
import com.financelab.realestateservice.dto.PropertyTransactionDTO;
import com.financelab.realestateservice.dto.CityDTO;

import java.math.BigDecimal;
import java.util.List;

public interface RealEstateService {
    
    // 城市相关操作
    List<CityDTO> getAllCities();
    CityDTO getCityById(Long cityId);
    List<CityDTO> getCitiesByRegion(String region);
    
    // 房产相关操作
    List<PropertyDTO> getAllProperties();
    List<PropertyDTO> getPropertiesByCity(Long cityId);
    List<PropertyDTO> getPropertiesForSale();
    List<PropertyDTO> getUserProperties(String userId);
    PropertyDTO getPropertyById(Long propertyId);
    
    // 房产交易
    PropertyTransactionDTO purchaseProperty(String userId, Long propertyId, BigDecimal purchasePrice);
    PropertyTransactionDTO sellProperty(String userId, Long propertyId, BigDecimal sellPrice);
    PropertyTransactionDTO rentProperty(String userId, Long propertyId, Integer durationMonths);
    PropertyTransactionDTO cancelRental(String userId, Long propertyId);
    
    // 房产管理
    PropertyDTO upgradeProperty(String userId, Long propertyId);
    PropertyDTO repairProperty(String userId, Long propertyId);
    PropertyDTO listPropertyForSale(String userId, Long propertyId, BigDecimal price);
    PropertyDTO removePropertyFromSale(String userId, Long propertyId);
    
    // 交易历史
    List<PropertyTransactionDTO> getUserTransactionHistory(String userId);
    List<PropertyTransactionDTO> getPropertyTransactionHistory(Long propertyId);
    
    // 统计分析
    BigDecimal calculateUserNetWorth(String userId);
    BigDecimal calculateUserMonthlyIncome(String userId);
    BigDecimal calculateUserMonthlyExpenses(String userId);
}