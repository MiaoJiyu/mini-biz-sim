package com.financelab.stockservice.config;

import com.financelab.stockservice.entity.Stock;
import com.financelab.stockservice.repository.StockRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
@Slf4j
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private StockRepository stockRepository;

    @Override
    public void run(String... args) throws Exception {
        initializeStocks();
    }

    private void initializeStocks() {
        if (stockRepository.count() == 0) {
            log.info("开始初始化股票数据...");
            
            List<Stock> stocks = Arrays.asList(
                createStock("000001", "平安银行", "平安银行股份有限公司", "金融", 15.50, 5),
                createStock("000002", "万科A", "万科企业股份有限公司", "房地产", 25.80, 7),
                createStock("000858", "五粮液", "宜宾五粮液股份有限公司", "消费", 160.45, 6),
                createStock("600036", "招商银行", "招商银行股份有限公司", "金融", 35.20, 4),
                createStock("600519", "贵州茅台", "贵州茅台酒股份有限公司", "消费", 1800.00, 3),
                createStock("601318", "中国平安", "中国平安保险(集团)股份有限公司", "金融", 48.60, 5),
                createStock("601888", "中国中免", "中国旅游集团中免股份有限公司", "消费", 95.30, 8),
                createStock("603259", "药明康德", "无锡药明康德新药开发股份有限公司", "医药", 75.80, 9),
                createStock("300750", "宁德时代", "宁德时代新能源科技股份有限公司", "新能源", 210.50, 10),
                createStock("688981", "中芯国际", "中芯国际集成电路制造有限公司", "科技", 45.60, 8)
            );
            
            stockRepository.saveAll(stocks);
            log.info("成功初始化 {} 只股票数据", stocks.size());
        } else {
            log.info("股票数据已存在，跳过初始化");
        }
    }

    private Stock createStock(String code, String name, String company, String industry,
                             double price, int volatility) {
        Stock stock = new Stock();
        stock.setCode(code);
        stock.setName(name);
        stock.setCompany(company);
        stock.setIndustry(industry);
        stock.setCurrentPrice(BigDecimal.valueOf(price));
        stock.setPreviousClose(BigDecimal.valueOf(price));
        stock.setOpenPrice(BigDecimal.valueOf(price));
        stock.setHighPrice(BigDecimal.valueOf(price));
        stock.setLowPrice(BigDecimal.valueOf(price));
        stock.setVolume(1000000L);
        // 计算合理的市值（总股本设为相对较小的值以避免超出数据库限制）
        stock.setMarketCap(BigDecimal.valueOf(price).multiply(BigDecimal.valueOf(1000000))); // 使用100万股而不是1000万股
        stock.setVolatility(volatility);
        stock.setIsActive(true);

        return stock;
    }
}