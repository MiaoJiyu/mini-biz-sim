package com.financelab.realestateservice.service.impl;

import com.financelab.realestateservice.dto.CityDTO;
import com.financelab.realestateservice.dto.PropertyDTO;
import com.financelab.realestateservice.dto.PropertyTransactionDTO;
import com.financelab.realestateservice.entity.City;
import com.financelab.realestateservice.entity.Property;
import com.financelab.realestateservice.entity.PropertyPriceHistory;
import com.financelab.realestateservice.entity.PropertyTransaction;
import com.financelab.realestateservice.repository.CityRepository;
import com.financelab.realestateservice.repository.PropertyPriceHistoryRepository;
import com.financelab.realestateservice.repository.PropertyRepository;
import com.financelab.realestateservice.repository.PropertyTransactionRepository;
import com.financelab.realestateservice.service.RealEstateService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class RealEstateServiceImpl implements RealEstateService {
    
    @Autowired
    private CityRepository cityRepository;
    
    @Autowired
    private PropertyRepository propertyRepository;
    
    @Autowired
    private PropertyTransactionRepository transactionRepository;
    
    @Autowired
    private PropertyPriceHistoryRepository priceHistoryRepository;
    
    @Override
    public List<CityDTO> getAllCities() {
        return cityRepository.findAll().stream()
                .map(this::convertToCityDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public CityDTO getCityById(Long cityId) {
        City city = cityRepository.findById(cityId)
                .orElseThrow(() -> new RuntimeException("城市不存在"));
        return convertToCityDTO(city);
    }
    
    @Override
    public List<CityDTO> getCitiesByRegion(String region) {
        return cityRepository.findByRegion(region).stream()
                .map(this::convertToCityDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<PropertyDTO> getAllProperties() {
        return propertyRepository.findAll().stream()
                .map(this::convertToPropertyDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<PropertyDTO> getPropertiesByCity(Long cityId) {
        return propertyRepository.findByCityId(cityId).stream()
                .map(this::convertToPropertyDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<PropertyDTO> getPropertiesForSale() {
        return propertyRepository.findByIsForSaleTrue().stream()
                .map(this::convertToPropertyDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<PropertyDTO> getUserProperties(String userId) {
        return propertyRepository.findByOwnerId(userId).stream()
                .map(this::convertToPropertyDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public PropertyDTO getPropertyById(Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("房产不存在"));
        return convertToPropertyDTO(property);
    }
    
    @Override
    @Transactional
    public PropertyTransactionDTO purchaseProperty(String userId, Long propertyId, BigDecimal purchasePrice) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("房产不存在"));
        
        if (!property.getIsForSale()) {
            throw new RuntimeException("该房产不在售");
        }
        
        if (property.getOwnerId() != null) {
            throw new RuntimeException("该房产已被购买");
        }
        
        // 创建交易记录
        PropertyTransaction transaction = new PropertyTransaction();
        transaction.setProperty(property);
        transaction.setBuyerId(userId);
        transaction.setSellerId(null); // 系统出售
        transaction.setType("PURCHASE");
        transaction.setTransactionPrice(purchasePrice);
        transaction.setTransactionFee(calculateTransactionFee(purchasePrice));
        transaction.setTaxAmount(calculateTaxAmount(purchasePrice));
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setStatus("COMPLETED");
        
        // 更新房产信息
        property.setOwnerId(userId);
        property.setIsForSale(false);
        property.setPurchasePrice(purchasePrice);
        propertyRepository.save(property);
        
        PropertyTransaction savedTransaction = transactionRepository.save(transaction);
        return convertToTransactionDTO(savedTransaction);
    }
    
    @Override
    @Transactional
    public PropertyTransactionDTO sellProperty(String userId, Long propertyId, BigDecimal sellPrice) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("房产不存在"));
        
        if (!property.getOwnerId().equals(userId)) {
            throw new RuntimeException("您不是该房产的业主");
        }
        
        if (property.getIsRented()) {
            throw new RuntimeException("该房产已出租，无法出售");
        }
        
        // 创建交易记录
        PropertyTransaction transaction = new PropertyTransaction();
        transaction.setProperty(property);
        transaction.setBuyerId(null); // 系统回购
        transaction.setSellerId(userId);
        transaction.setType("SALE");
        transaction.setTransactionPrice(sellPrice);
        transaction.setTransactionFee(calculateTransactionFee(sellPrice));
        transaction.setTaxAmount(calculateTaxAmount(sellPrice));
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setStatus("COMPLETED");
        
        // 更新房产信息
        property.setOwnerId(null);
        property.setIsForSale(false);
        propertyRepository.save(property);
        
        PropertyTransaction savedTransaction = transactionRepository.save(transaction);
        return convertToTransactionDTO(savedTransaction);
    }
    
    @Override
    @Transactional
    public PropertyTransactionDTO rentProperty(String userId, Long propertyId, Integer durationMonths) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("房产不存在"));
        
        if (property.getIsRented()) {
            throw new RuntimeException("该房产已出租");
        }
        
        if (property.getOwnerId() == null) {
            throw new RuntimeException("系统房产不可出租");
        }
        
        if (durationMonths < 1 || durationMonths > 36) {
            throw new RuntimeException("租赁时长必须在1-36个月之间");
        }
        
        // 创建租赁交易记录
        PropertyTransaction transaction = new PropertyTransaction();
        transaction.setProperty(property);
        transaction.setBuyerId(userId);
        transaction.setSellerId(property.getOwnerId());
        transaction.setType("RENT");
        transaction.setTransactionPrice(property.getRentalIncome().multiply(BigDecimal.valueOf(durationMonths)));
        transaction.setTransactionFee(BigDecimal.ZERO);
        transaction.setTaxAmount(BigDecimal.ZERO);
        transaction.setRentalDuration(durationMonths);
        transaction.setRentalStartDate(LocalDateTime.now());
        transaction.setRentalEndDate(LocalDateTime.now().plusMonths(durationMonths));
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setStatus("COMPLETED");
        
        // 更新房产信息
        property.setIsRented(true);
        propertyRepository.save(property);
        
        PropertyTransaction savedTransaction = transactionRepository.save(transaction);
        return convertToTransactionDTO(savedTransaction);
    }
    
    @Override
    @Transactional
    public PropertyTransactionDTO cancelRental(String userId, Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("房产不存在"));
        
        if (!property.getIsRented()) {
            throw new RuntimeException("该房产未出租");
        }
        
        if (!property.getOwnerId().equals(userId)) {
            throw new RuntimeException("您不是该房产的业主");
        }
        
        // 更新房产信息
        property.setIsRented(false);
        propertyRepository.save(property);
        
        // 创建取消租赁记录
        PropertyTransaction transaction = new PropertyTransaction();
        transaction.setProperty(property);
        transaction.setBuyerId(null);
        transaction.setSellerId(userId);
        transaction.setType("RENT_CANCELLATION");
        transaction.setTransactionPrice(BigDecimal.ZERO);
        transaction.setTransactionFee(BigDecimal.ZERO);
        transaction.setTaxAmount(BigDecimal.ZERO);
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setStatus("COMPLETED");
        
        PropertyTransaction savedTransaction = transactionRepository.save(transaction);
        return convertToTransactionDTO(savedTransaction);
    }
    
    @Override
    @Transactional
    public PropertyDTO upgradeProperty(String userId, Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("房产不存在"));
        
        if (!property.getOwnerId().equals(userId)) {
            throw new RuntimeException("您不是该房产的业主");
        }
        
        if (property.getUpgradeLevel() >= property.getMaxUpgradeLevel()) {
            throw new RuntimeException("已达到最大装修等级");
        }
        
        // 升级房产
        property.setUpgradeLevel(property.getUpgradeLevel() + 1);
        property.setCurrentPrice(property.getCurrentPrice().multiply(BigDecimal.valueOf(1.1))); // 价格提升10%
        
        Property savedProperty = propertyRepository.save(property);
        return convertToPropertyDTO(savedProperty);
    }
    
    @Override
    @Transactional
    public PropertyDTO repairProperty(String userId, Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("房产不存在"));
        
        if (!property.getOwnerId().equals(userId)) {
            throw new RuntimeException("您不是该房产的业主");
        }
        
        if (property.getConditionRating() >= 10) {
            throw new RuntimeException("房屋状况已经很好");
        }
        
        // 修复房产
        property.setConditionRating(Math.min(10, property.getConditionRating() + 1));
        
        Property savedProperty = propertyRepository.save(property);
        return convertToPropertyDTO(savedProperty);
    }
    
    @Override
    @Transactional
    public PropertyDTO listPropertyForSale(String userId, Long propertyId, BigDecimal price) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("房产不存在"));
        
        if (!property.getOwnerId().equals(userId)) {
            throw new RuntimeException("您不是该房产的业主");
        }
        
        if (property.getIsRented()) {
            throw new RuntimeException("该房产已出租，无法出售");
        }
        
        // 挂牌出售
        property.setIsForSale(true);
        property.setCurrentPrice(price);
        
        Property savedProperty = propertyRepository.save(property);
        return convertToPropertyDTO(savedProperty);
    }
    
    @Override
    @Transactional
    public PropertyDTO removePropertyFromSale(String userId, Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("房产不存在"));
        
        if (!property.getOwnerId().equals(userId)) {
            throw new RuntimeException("您不是该房产的业主");
        }
        
        // 取消挂牌
        property.setIsForSale(false);
        
        Property savedProperty = propertyRepository.save(property);
        return convertToPropertyDTO(savedProperty);
    }
    
    @Override
    public List<PropertyTransactionDTO> getUserTransactionHistory(String userId) {
        return transactionRepository.findUserTransactionHistory(userId).stream()
                .map(this::convertToTransactionDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<PropertyTransactionDTO> getPropertyTransactionHistory(Long propertyId) {
        return transactionRepository.findByPropertyId(propertyId).stream()
                .map(this::convertToTransactionDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public BigDecimal calculateUserNetWorth(String userId) {
        List<Property> userProperties = propertyRepository.findByOwnerId(userId);
        return userProperties.stream()
                .map(Property::getCurrentPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    @Override
    public BigDecimal calculateUserMonthlyIncome(String userId) {
        List<Property> userProperties = propertyRepository.findByOwnerId(userId);
        return userProperties.stream()
                .filter(Property::getIsRented)
                .map(Property::getRentalIncome)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    @Override
    public BigDecimal calculateUserMonthlyExpenses(String userId) {
        List<Property> userProperties = propertyRepository.findByOwnerId(userId);
        return userProperties.stream()
                .map(property -> property.getMaintenanceCost().add(property.getPropertyTax()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    // 辅助方法：计算交易费用（价格的1%）
    private BigDecimal calculateTransactionFee(BigDecimal price) {
        return price.multiply(BigDecimal.valueOf(0.01)).setScale(2, RoundingMode.HALF_UP);
    }
    
    // 辅助方法：计算税费（价格的5%）
    private BigDecimal calculateTaxAmount(BigDecimal price) {
        return price.multiply(BigDecimal.valueOf(0.05)).setScale(2, RoundingMode.HALF_UP);
    }
    
    // DTO转换方法
    private CityDTO convertToCityDTO(City city) {
        CityDTO dto = new CityDTO();
        dto.setId(city.getId());
        dto.setName(city.getName());
        dto.setRegion(city.getRegion());
        dto.setBasePricePerSqm(city.getBasePricePerSqm());
        dto.setPriceVolatility(city.getPriceVolatility());
        dto.setGrowthRate(city.getGrowthRate());
        dto.setPopulationDensity(city.getPopulationDensity());
        dto.setEconomicDevelopmentLevel(city.getEconomicDevelopmentLevel());
        dto.setInfrastructureScore(city.getInfrastructureScore());
        return dto;
    }
    
    private PropertyDTO convertToPropertyDTO(Property property) {
        PropertyDTO dto = new PropertyDTO();
        dto.setId(property.getId());
        dto.setName(property.getName());
        dto.setCity(convertToCityDTO(property.getCity()));
        dto.setType(property.getType());
        dto.setLocation(property.getLocation());
        dto.setTotalArea(property.getTotalArea());
        dto.setUsableArea(property.getUsableArea());
        dto.setPurchasePrice(property.getPurchasePrice());
        dto.setCurrentPrice(property.getCurrentPrice());
        dto.setRentalIncome(property.getRentalIncome());
        dto.setMaintenanceCost(property.getMaintenanceCost());
        dto.setPropertyTax(property.getPropertyTax());
        dto.setConstructionYear(property.getConstructionYear());
        dto.setConditionRating(property.getConditionRating());
        dto.setUpgradeLevel(property.getUpgradeLevel());
        dto.setMaxUpgradeLevel(property.getMaxUpgradeLevel());
        dto.setIsForSale(property.getIsForSale());
        dto.setIsRented(property.getIsRented());
        dto.setOwnerId(property.getOwnerId());
        
        // 计算额外属性
        if (property.getPurchasePrice() != null && property.getPurchasePrice().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal priceChange = property.getCurrentPrice().subtract(property.getPurchasePrice());
            BigDecimal priceChangeRate = priceChange.divide(property.getPurchasePrice(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
            dto.setPriceChange(priceChange);
            dto.setPriceChangeRate(priceChangeRate);
        }
        
        if (property.getCurrentPrice() != null && property.getCurrentPrice().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal rentalYield = property.getRentalIncome()
                    .multiply(BigDecimal.valueOf(12))
                    .divide(property.getCurrentPrice(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
            dto.setRentalYield(rentalYield);
        }
        
        if (property.getRentalIncome() != null && property.getMaintenanceCost() != null) {
            dto.setNetMonthlyIncome(property.getRentalIncome().subtract(property.getMaintenanceCost()));
        }
        
        return dto;
    }
    
    private PropertyTransactionDTO convertToTransactionDTO(PropertyTransaction transaction) {
        PropertyTransactionDTO dto = new PropertyTransactionDTO();
        dto.setId(transaction.getId());
        dto.setProperty(convertToPropertyDTO(transaction.getProperty()));
        dto.setBuyerId(transaction.getBuyerId());
        dto.setSellerId(transaction.getSellerId());
        dto.setType(transaction.getType());
        dto.setTransactionPrice(transaction.getTransactionPrice());
        dto.setTransactionFee(transaction.getTransactionFee());
        dto.setTaxAmount(transaction.getTaxAmount());
        dto.setRentalDuration(transaction.getRentalDuration());
        dto.setRentalStartDate(transaction.getRentalStartDate());
        dto.setRentalEndDate(transaction.getRentalEndDate());
        dto.setTransactionDate(transaction.getTransactionDate());
        dto.setStatus(transaction.getStatus());
        
        // 计算总金额
        BigDecimal totalAmount = transaction.getTransactionPrice()
                .add(transaction.getTransactionFee())
                .add(transaction.getTaxAmount());
        dto.setTotalAmount(totalAmount);
        
        return dto;
    }
}