package com.financelab.bankservice.config;

import com.financelab.bankservice.entity.InvestmentProduct;
import com.financelab.bankservice.repository.InvestmentProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final InvestmentProductRepository investmentProductRepository;
    
    @Override
    public void run(String... args) {
        if (investmentProductRepository.count() == 0) {
            initializeInvestmentProducts();
        }
    }
    
    private void initializeInvestmentProducts() {
        log.info("开始初始化理财产品数据...");
        
        // 固定收益类产品
        createProduct("FX001", "稳健理财30天", InvestmentProduct.ProductType.FIXED_INCOME,
            new BigDecimal("1000"), new BigDecimal("1000000"), new BigDecimal("3.5"),
            new BigDecimal("2.0"), 30, new BigDecimal("1.0"),
            "低风险固定收益产品，适合稳健型投资者");
        
        createProduct("FX002", "稳健理财90天", InvestmentProduct.ProductType.FIXED_INCOME,
            new BigDecimal("5000"), new BigDecimal("500000"), new BigDecimal("4.0"),
            new BigDecimal("2.0"), 90, new BigDecimal("1.5"),
            "中短期固定收益产品，收益稳定");
        
        createProduct("FX003", "稳健理财180天", InvestmentProduct.ProductType.FIXED_INCOME,
            new BigDecimal("10000"), new BigDecimal("300000"), new BigDecimal("4.5"),
            new BigDecimal("2.5"), 180, new BigDecimal("2.0"),
            "中期固定收益产品，收益适中");
        
        createProduct("FX004", "稳健理财365天", InvestmentProduct.ProductType.FIXED_INCOME,
            new BigDecimal("20000"), new BigDecimal("200000"), new BigDecimal("5.0"),
            new BigDecimal("2.5"), 365, new BigDecimal("2.5"),
            "长期固定收益产品，收益较高");
        
        // 基金类产品
        createProduct("FUND001", "股票型基金A", InvestmentProduct.ProductType.FUND,
            new BigDecimal("10000"), new BigDecimal("1000000"), new BigDecimal("8.0"),
            new BigDecimal("7.0"), 365, new BigDecimal("3.0"),
            "主要投资于优质股票，风险较高，收益潜力大");
        
        createProduct("FUND002", "混合型基金B", InvestmentProduct.ProductType.FUND,
            new BigDecimal("5000"), new BigDecimal("800000"), new BigDecimal("6.0"),
            new BigDecimal("5.0"), 365, new BigDecimal("2.5"),
            "股票与债券混合投资，平衡风险与收益");
        
        createProduct("FUND003", "债券型基金C", InvestmentProduct.ProductType.FUND,
            new BigDecimal("3000"), new BigDecimal("600000"), new BigDecimal("4.5"),
            new BigDecimal("3.5"), 365, new BigDecimal("2.0"),
            "主要投资于债券，风险较低，收益稳定");
        
        // 结构性产品
        createProduct("STRUCT001", "保本理财计划1号", InvestmentProduct.ProductType.STRUCTURED,
            new BigDecimal("50000"), new BigDecimal("500000"), new BigDecimal("5.5"),
            new BigDecimal("1.5"), 180, new BigDecimal("1.0"),
            "保本型结构性产品，本金保障，收益与市场表现挂钩");
        
        createProduct("STRUCT002", "指数挂钩理财", InvestmentProduct.ProductType.STRUCTURED,
            new BigDecimal("100000"), new BigDecimal("1000000"), new BigDecimal("7.5"),
            new BigDecimal("4.0"), 365, new BigDecimal("3.5"),
            "收益与股票指数表现挂钩，保本收益较高");
        
        // 混合型产品
        createProduct("HYBRID001", "平衡理财组合", InvestmentProduct.ProductType.HYBRID,
            new BigDecimal("20000"), new BigDecimal("400000"), new BigDecimal("5.5"),
            new BigDecimal("4.5"), 365, new BigDecimal("2.0"),
            "多元化投资组合，分散风险，稳健增值");
        
        createProduct("HYBRID002", "成长理财组合", InvestmentProduct.ProductType.HYBRID,
            new BigDecimal("50000"), new BigDecimal("600000"), new BigDecimal("7.0"),
            new BigDecimal("5.5"), 365, new BigDecimal("3.0"),
            "成长型投资组合，追求长期收益");
        
        log.info("理财产品数据初始化完成，共创建 {} 个产品", investmentProductRepository.count());
    }
    
    private void createProduct(String productCode, String productName, InvestmentProduct.ProductType productType,
                              BigDecimal minAmount, BigDecimal maxAmount, BigDecimal returnRate,
                              BigDecimal riskLevel, int termDays, BigDecimal penalty, String description) {
        InvestmentProduct product = new InvestmentProduct();
        product.setProductCode(productCode);
        product.setProductName(productName);
        product.setProductType(productType);
        product.setMinInvestmentAmount(minAmount);
        product.setMaxInvestmentAmount(maxAmount);
        product.setExpectedReturnRate(returnRate);
        product.setRiskLevel(riskLevel);
        product.setTermDays(termDays);
        product.setEarlyWithdrawalPenalty(penalty);
        product.setDescription(description);
        product.setStatus(InvestmentProduct.ProductStatus.AVAILABLE);
        product.setCreatedAt(LocalDateTime.now());
        
        investmentProductRepository.save(product);
        log.info("创建理财产品: {} - {}", productCode, productName);
    }
}
