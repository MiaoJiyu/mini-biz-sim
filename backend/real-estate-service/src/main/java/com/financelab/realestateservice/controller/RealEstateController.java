package com.financelab.realestateservice.controller;

import com.financelab.realestateservice.dto.CityDTO;
import com.financelab.realestateservice.dto.PropertyDTO;
import com.financelab.realestateservice.dto.PropertyTransactionDTO;
import com.financelab.realestateservice.service.RealEstateService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/real-estate")
@Slf4j
public class RealEstateController {
    
    @Autowired
    private RealEstateService realEstateService;
    
    // 城市相关接口
    @GetMapping("/cities")
    public ResponseEntity<List<CityDTO>> getAllCities() {
        try {
            List<CityDTO> cities = realEstateService.getAllCities();
            return ResponseEntity.ok(cities);
        } catch (Exception e) {
            log.error("获取城市列表失败", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/cities/{cityId}")
    public ResponseEntity<CityDTO> getCityById(@PathVariable Long cityId) {
        try {
            CityDTO city = realEstateService.getCityById(cityId);
            return ResponseEntity.ok(city);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("获取城市信息失败，城市ID: {}", cityId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/cities/region/{region}")
    public ResponseEntity<List<CityDTO>> getCitiesByRegion(@PathVariable String region) {
        try {
            List<CityDTO> cities = realEstateService.getCitiesByRegion(region);
            return ResponseEntity.ok(cities);
        } catch (Exception e) {
            log.error("获取区域城市列表失败，区域: {}", region, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 房产相关接口
    @GetMapping("/properties")
    public ResponseEntity<List<PropertyDTO>> getAllProperties() {
        try {
            List<PropertyDTO> properties = realEstateService.getAllProperties();
            return ResponseEntity.ok(properties);
        } catch (Exception e) {
            log.error("获取房产列表失败", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/properties/city/{cityId}")
    public ResponseEntity<List<PropertyDTO>> getPropertiesByCity(@PathVariable Long cityId) {
        try {
            List<PropertyDTO> properties = realEstateService.getPropertiesByCity(cityId);
            return ResponseEntity.ok(properties);
        } catch (Exception e) {
            log.error("获取城市房产列表失败，城市ID: {}", cityId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/properties/for-sale")
    public ResponseEntity<List<PropertyDTO>> getPropertiesForSale() {
        try {
            List<PropertyDTO> properties = realEstateService.getPropertiesForSale();
            return ResponseEntity.ok(properties);
        } catch (Exception e) {
            log.error("获取在售房产列表失败", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/properties/{propertyId}")
    public ResponseEntity<PropertyDTO> getPropertyById(@PathVariable Long propertyId) {
        try {
            PropertyDTO property = realEstateService.getPropertyById(propertyId);
            return ResponseEntity.ok(property);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("获取房产信息失败，房产ID: {}", propertyId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/properties/user/{userId}")
    public ResponseEntity<List<PropertyDTO>> getUserProperties(@PathVariable String userId) {
        try {
            List<PropertyDTO> properties = realEstateService.getUserProperties(userId);
            return ResponseEntity.ok(properties);
        } catch (Exception e) {
            log.error("获取用户房产列表失败，用户ID: {}", userId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 房产交易接口
    @PostMapping("/properties/{propertyId}/purchase")
    public ResponseEntity<PropertyTransactionDTO> purchaseProperty(
            @PathVariable Long propertyId,
            @RequestParam String userId,
            @RequestParam BigDecimal purchasePrice) {
        try {
            PropertyTransactionDTO transaction = realEstateService.purchaseProperty(userId, propertyId, purchasePrice);
            log.info("用户 {} 成功购买房产 {}，价格：{}", userId, propertyId, purchasePrice);
            return ResponseEntity.ok(transaction);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            log.error("购买房产失败，用户ID: {}, 房产ID: {}", userId, propertyId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/properties/{propertyId}/sell")
    public ResponseEntity<PropertyTransactionDTO> sellProperty(
            @PathVariable Long propertyId,
            @RequestParam String userId,
            @RequestParam BigDecimal sellPrice) {
        try {
            PropertyTransactionDTO transaction = realEstateService.sellProperty(userId, propertyId, sellPrice);
            log.info("用户 {} 成功出售房产 {}，价格：{}", userId, propertyId, sellPrice);
            return ResponseEntity.ok(transaction);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            log.error("出售房产失败，用户ID: {}, 房产ID: {}", userId, propertyId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/properties/{propertyId}/rent")
    public ResponseEntity<PropertyTransactionDTO> rentProperty(
            @PathVariable Long propertyId,
            @RequestParam String userId,
            @RequestParam Integer durationMonths) {
        try {
            PropertyTransactionDTO transaction = realEstateService.rentProperty(userId, propertyId, durationMonths);
            log.info("用户 {} 成功租赁房产 {}，时长：{}个月", userId, propertyId, durationMonths);
            return ResponseEntity.ok(transaction);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            log.error("租赁房产失败，用户ID: {}, 房产ID: {}", userId, propertyId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/properties/{propertyId}/cancel-rental")
    public ResponseEntity<PropertyTransactionDTO> cancelRental(
            @PathVariable Long propertyId,
            @RequestParam String userId) {
        try {
            PropertyTransactionDTO transaction = realEstateService.cancelRental(userId, propertyId);
            log.info("用户 {} 成功取消房产 {} 的租赁", userId, propertyId);
            return ResponseEntity.ok(transaction);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            log.error("取消租赁失败，用户ID: {}, 房产ID: {}", userId, propertyId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 房产管理接口
    @PostMapping("/properties/{propertyId}/upgrade")
    public ResponseEntity<PropertyDTO> upgradeProperty(
            @PathVariable Long propertyId,
            @RequestParam String userId) {
        try {
            PropertyDTO property = realEstateService.upgradeProperty(userId, propertyId);
            log.info("用户 {} 成功升级房产 {}，当前等级：{}", userId, propertyId, property.getUpgradeLevel());
            return ResponseEntity.ok(property);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            log.error("升级房产失败，用户ID: {}, 房产ID: {}", userId, propertyId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/properties/{propertyId}/repair")
    public ResponseEntity<PropertyDTO> repairProperty(
            @PathVariable Long propertyId,
            @RequestParam String userId) {
        try {
            PropertyDTO property = realEstateService.repairProperty(userId, propertyId);
            log.info("用户 {} 成功修复房产 {}，当前状况：{}/10", userId, propertyId, property.getConditionRating());
            return ResponseEntity.ok(property);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            log.error("修复房产失败，用户ID: {}, 房产ID: {}", userId, propertyId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/properties/{propertyId}/list-for-sale")
    public ResponseEntity<PropertyDTO> listPropertyForSale(
            @PathVariable Long propertyId,
            @RequestParam String userId,
            @RequestParam BigDecimal price) {
        try {
            PropertyDTO property = realEstateService.listPropertyForSale(userId, propertyId, price);
            log.info("用户 {} 成功挂牌房产 {}，价格：{}", userId, propertyId, price);
            return ResponseEntity.ok(property);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            log.error("挂牌房产失败，用户ID: {}, 房产ID: {}", userId, propertyId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/properties/{propertyId}/remove-from-sale")
    public ResponseEntity<PropertyDTO> removePropertyFromSale(
            @PathVariable Long propertyId,
            @RequestParam String userId) {
        try {
            PropertyDTO property = realEstateService.removePropertyFromSale(userId, propertyId);
            log.info("用户 {} 成功取消房产 {} 的挂牌", userId, propertyId);
            return ResponseEntity.ok(property);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            log.error("取消挂牌失败，用户ID: {}, 房产ID: {}", userId, propertyId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 交易历史接口
    @GetMapping("/transactions/user/{userId}")
    public ResponseEntity<List<PropertyTransactionDTO>> getUserTransactionHistory(@PathVariable String userId) {
        try {
            List<PropertyTransactionDTO> transactions = realEstateService.getUserTransactionHistory(userId);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            log.error("获取用户交易历史失败，用户ID: {}", userId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/transactions/property/{propertyId}")
    public ResponseEntity<List<PropertyTransactionDTO>> getPropertyTransactionHistory(@PathVariable Long propertyId) {
        try {
            List<PropertyTransactionDTO> transactions = realEstateService.getPropertyTransactionHistory(propertyId);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            log.error("获取房产交易历史失败，房产ID: {}", propertyId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 统计分析接口
    @GetMapping("/user/{userId}/net-worth")
    public ResponseEntity<BigDecimal> calculateUserNetWorth(@PathVariable String userId) {
        try {
            BigDecimal netWorth = realEstateService.calculateUserNetWorth(userId);
            return ResponseEntity.ok(netWorth);
        } catch (Exception e) {
            log.error("计算用户净资产失败，用户ID: {}", userId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/user/{userId}/monthly-income")
    public ResponseEntity<BigDecimal> calculateUserMonthlyIncome(@PathVariable String userId) {
        try {
            BigDecimal monthlyIncome = realEstateService.calculateUserMonthlyIncome(userId);
            return ResponseEntity.ok(monthlyIncome);
        } catch (Exception e) {
            log.error("计算用户月收入失败，用户ID: {}", userId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/user/{userId}/monthly-expenses")
    public ResponseEntity<BigDecimal> calculateUserMonthlyExpenses(@PathVariable String userId) {
        try {
            BigDecimal monthlyExpenses = realEstateService.calculateUserMonthlyExpenses(userId);
            return ResponseEntity.ok(monthlyExpenses);
        } catch (Exception e) {
            log.error("计算用户月支出失败，用户ID: {}", userId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
}