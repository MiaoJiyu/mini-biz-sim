package com.financelab.stockservice.service;

import com.financelab.stockservice.entity.Stock;
import com.financelab.stockservice.entity.StockPriceHistory;
import com.financelab.stockservice.repository.StockPriceHistoryRepository;
import com.financelab.stockservice.repository.StockRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class StockPriceSimulator {
    
    @Autowired
    private StockRepository stockRepository;
    
    @Autowired
    private StockPriceHistoryRepository priceHistoryRepository;
    
    private final Random random = new Random();
    private final ConcurrentHashMap<String, BigDecimal> lastPrices = new ConcurrentHashMap<>();
    
    @PostConstruct
    public void init() {
        log.info("初始化股票价格模拟器...");
        initializeStockPrices();
    }
    
    /**
     * 初始化股票价格
     */
    private void initializeStockPrices() {
        List<Stock> stocks = stockRepository.findAll();
        for (Stock stock : stocks) {
            // 如果股票没有初始价格，设置一个合理的随机价格
            if (stock.getCurrentPrice() == null || stock.getCurrentPrice().compareTo(BigDecimal.ZERO) <= 0) {
                BigDecimal initialPrice = generateRandomPrice(50, 500); // 50-500元范围内的随机价格
                stock.setCurrentPrice(initialPrice);
                stock.setPreviousClose(initialPrice);
                stock.setOpenPrice(initialPrice);
                stock.setHighPrice(initialPrice);
                stock.setLowPrice(initialPrice);
                stock.setMarketCap(initialPrice.multiply(BigDecimal.valueOf(10000000))); // 假设1千万股
                stockRepository.save(stock);
            }
            lastPrices.put(stock.getCode(), stock.getCurrentPrice());
        }
        log.info("已初始化 {} 只股票的价格", stocks.size());
    }
    
    /**
     * 每5秒更新一次股票价格（模拟实时行情）
     */
    @Scheduled(fixedRate = 5000)
    public void simulatePriceChanges() {
        List<Stock> activeStocks = stockRepository.findByIsActiveTrue();
        
        for (Stock stock : activeStocks) {
            BigDecimal newPrice = calculateNewPrice(stock);
            updateStockPrice(stock, newPrice);
            savePriceHistory(stock, newPrice);
        }
        
        log.debug("已更新 {} 只股票的实时价格", activeStocks.size());
    }
    
    /**
     * 计算新的股票价格
     */
    private BigDecimal calculateNewPrice(Stock stock) {
        BigDecimal currentPrice = stock.getCurrentPrice();
        BigDecimal lastPrice = lastPrices.get(stock.getCode());
        
        if (lastPrice == null) {
            lastPrice = currentPrice;
            lastPrices.put(stock.getCode(), lastPrice);
        }
        
        // 根据波动率计算价格变化
        double volatilityFactor = stock.getVolatility() / 10.0; // 波动率因子
        double randomChange = (random.nextDouble() - 0.5) * 0.1 * volatilityFactor; // -5% 到 +5%
        
        BigDecimal changePercent = BigDecimal.valueOf(randomChange);
        BigDecimal changeAmount = currentPrice.multiply(changePercent);
        BigDecimal newPrice = currentPrice.add(changeAmount);
        
        // 确保价格不为负
        if (newPrice.compareTo(BigDecimal.ZERO) <= 0) {
            newPrice = BigDecimal.valueOf(0.01); // 最低价格0.01元
        }
        
        return newPrice.setScale(2, RoundingMode.HALF_UP);
    }
    
    /**
     * 更新股票价格
     */
    private void updateStockPrice(Stock stock, BigDecimal newPrice) {
        BigDecimal currentPrice = stock.getCurrentPrice();
        
        // 更新最高价和最低价
        if (newPrice.compareTo(stock.getHighPrice()) > 0) {
            stock.setHighPrice(newPrice);
        }
        if (newPrice.compareTo(stock.getLowPrice()) < 0) {
            stock.setLowPrice(newPrice);
        }
        
        // 更新当前价格
        stock.setCurrentPrice(newPrice);
        
        // 随机生成成交量（基于价格变化）
        long volumeChange = (long) (Math.abs(newPrice.subtract(currentPrice).doubleValue() / currentPrice.doubleValue()) * 10000);
        stock.setVolume(stock.getVolume() + volumeChange);
        
        stockRepository.save(stock);
        lastPrices.put(stock.getCode(), newPrice);
    }
    
    /**
     * 保存价格历史记录
     */
    private void savePriceHistory(Stock stock, BigDecimal price) {
        StockPriceHistory history = new StockPriceHistory();
        history.setStock(stock);
        history.setPrice(price);
        history.setVolume(BigDecimal.valueOf(stock.getVolume()));
        history.setTimestamp(LocalDateTime.now());
        history.setType(StockPriceHistory.PriceType.TRADE);
        
        priceHistoryRepository.save(history);
    }
    
    /**
     * 生成随机价格
     */
    private BigDecimal generateRandomPrice(double min, double max) {
        double price = min + (max - min) * random.nextDouble();
        return BigDecimal.valueOf(price).setScale(2, RoundingMode.HALF_UP);
    }
    
    /**
     * 获取当前所有股票的最新价格
     */
    public ConcurrentHashMap<String, BigDecimal> getCurrentPrices() {
        return new ConcurrentHashMap<>(lastPrices);
    }
}