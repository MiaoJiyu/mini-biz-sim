package com.financelab.realestateservice.config;

import com.financelab.realestateservice.entity.City;
import com.financelab.realestateservice.entity.Property;
import com.financelab.realestateservice.repository.CityRepository;
import com.financelab.realestateservice.repository.PropertyRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private CityRepository cityRepository;
    
    @Autowired
    private PropertyRepository propertyRepository;
    
    @Override
    public void run(String... args) throws Exception {
        log.info("开始初始化房地产数据...");
        
        if (cityRepository.count() == 0) {
            initializeCities();
        }
        
        if (propertyRepository.count() == 0) {
            initializeProperties();
        }
        
        log.info("房地产数据初始化完成");
    }
    
    private void initializeCities() {
        List<City> cities = Arrays.asList(
                createCity("北京", "华北", new BigDecimal("80000"), new BigDecimal("0.15"), new BigDecimal("0.08"), 2100, 9, 9),
                createCity("上海", "华东", new BigDecimal("75000"), new BigDecimal("0.12"), new BigDecimal("0.07"), 2400, 9, 9),
                createCity("深圳", "华南", new BigDecimal("70000"), new BigDecimal("0.18"), new BigDecimal("0.09"), 1800, 8, 8),
                createCity("广州", "华南", new BigDecimal("45000"), new BigDecimal("0.10"), new BigDecimal("0.06"), 1500, 8, 8),
                createCity("杭州", "华东", new BigDecimal("40000"), new BigDecimal("0.14"), new BigDecimal("0.08"), 1200, 7, 7),
                createCity("成都", "西南", new BigDecimal("25000"), new BigDecimal("0.08"), new BigDecimal("0.05"), 1000, 7, 7),
                createCity("重庆", "西南", new BigDecimal("18000"), new BigDecimal("0.07"), new BigDecimal("0.04"), 800, 6, 6),
                createCity("武汉", "华中", new BigDecimal("22000"), new BigDecimal("0.09"), new BigDecimal("0.05"), 900, 6, 6),
                createCity("西安", "西北", new BigDecimal("15000"), new BigDecimal("0.06"), new BigDecimal("0.03"), 700, 5, 5),
                createCity("沈阳", "东北", new BigDecimal("12000"), new BigDecimal("0.05"), new BigDecimal("0.02"), 600, 5, 5)
        );
        
        cityRepository.saveAll(cities);
        log.info("初始化 {} 个城市数据", cities.size());
    }
    
    private City createCity(String name, String region, BigDecimal basePrice, BigDecimal volatility, 
                           BigDecimal growthRate, Integer density, Integer economicLevel, Integer infraScore) {
        City city = new City();
        city.setName(name);
        city.setRegion(region);
        city.setBasePricePerSqm(basePrice);
        city.setPriceVolatility(volatility);
        city.setGrowthRate(growthRate);
        city.setPopulationDensity(density);
        city.setEconomicDevelopmentLevel(economicLevel);
        city.setInfrastructureScore(infraScore);
        return city;
    }
    
    private void initializeProperties() {
        List<City> cities = cityRepository.findAll();
        
        for (City city : cities) {
            List<Property> properties = Arrays.asList(
                    createProperty(city, "豪华公寓", "RESIDENTIAL", "市中心黄金地段", 
                            new BigDecimal("120"), new BigDecimal("100"), new BigDecimal("10000000"), new BigDecimal("15000"), 2020, 8),
                    createProperty(city, "写字楼", "COMMERCIAL", "商务区核心位置", 
                            new BigDecimal("500"), new BigDecimal("450"), new BigDecimal("30000000"), new BigDecimal("50000"), 2018, 7),
                    createProperty(city, "商铺", "COMMERCIAL", "商业街临街位置", 
                            new BigDecimal("80"), new BigDecimal("70"), new BigDecimal("6000000"), new BigDecimal("10000"), 2015, 6),
                    createProperty(city, "别墅", "RESIDENTIAL", "郊区高档社区", 
                            new BigDecimal("300"), new BigDecimal("250"), new BigDecimal("20000000"), new BigDecimal("25000"), 2019, 9),
                    createProperty(city, "工业厂房", "INDUSTRIAL", "工业园区内", 
                            new BigDecimal("1000"), new BigDecimal("800"), new BigDecimal("15000000"), new BigDecimal("20000"), 2010, 5),
                    createProperty(city, "土地", "LAND", "城市发展新区", 
                            new BigDecimal("5000"), new BigDecimal("5000"), new BigDecimal("50000000"), BigDecimal.ZERO, null, 10)
            );
            
            propertyRepository.saveAll(properties);
        }
        
        log.info("初始化 {} 个城市共计 {} 处房产数据", cities.size(), cities.size() * 6);
    }
    
    private Property createProperty(City city, String name, String type, String location,
                                   BigDecimal totalArea, BigDecimal usableArea, BigDecimal purchasePrice,
                                   BigDecimal rentalIncome, Integer constructionYear, Integer conditionRating) {
        Property property = new Property();
        property.setName(city.getName() + " - " + name);
        property.setCity(city);
        property.setType(type);
        property.setLocation(location);
        property.setTotalArea(totalArea);
        property.setUsableArea(usableArea);
        property.setPurchasePrice(purchasePrice);
        property.setCurrentPrice(purchasePrice.multiply(new BigDecimal("1.1"))); // 当前价格比购买价高10%
        property.setRentalIncome(rentalIncome);
        property.setMaintenanceCost(rentalIncome.multiply(new BigDecimal("0.2"))); // 维护费用为租金的20%
        property.setPropertyTax(purchasePrice.multiply(new BigDecimal("0.001")).divide(new BigDecimal("12"), 2, BigDecimal.ROUND_HALF_UP)); // 房产税为年0.1%
        property.setConstructionYear(constructionYear);
        property.setConditionRating(conditionRating);
        property.setIsForSale(true);
        property.setIsRented(false);
        
        return property;
    }
}