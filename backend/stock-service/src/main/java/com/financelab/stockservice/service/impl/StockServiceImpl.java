package com.financelab.stockservice.service.impl;

import com.financelab.stockservice.dto.StockQuoteDTO;
import com.financelab.stockservice.dto.TradeRequestDTO;
import com.financelab.stockservice.dto.TradeResultDTO;
import com.financelab.stockservice.entity.Stock;
import com.financelab.stockservice.entity.StockPriceHistory;
import com.financelab.stockservice.entity.TradeRecord;
import com.financelab.stockservice.entity.UserPosition;
import com.financelab.stockservice.repository.StockPriceHistoryRepository;
import com.financelab.stockservice.repository.StockRepository;
import com.financelab.stockservice.repository.TradeRecordRepository;
import com.financelab.stockservice.repository.UserPositionRepository;
import com.financelab.stockservice.service.StockService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class StockServiceImpl implements StockService {
    
    @Autowired
    private StockRepository stockRepository;
    
    @Autowired
    private UserPositionRepository userPositionRepository;
    
    @Autowired
    private TradeRecordRepository tradeRecordRepository;
    
    @Autowired
    private StockPriceHistoryRepository priceHistoryRepository;
    
    @Override
    public StockQuoteDTO getStockQuote(String stockCode) {
        Optional<Stock> stockOpt = stockRepository.findByCode(stockCode);
        if (stockOpt.isEmpty()) {
            throw new RuntimeException("股票代码不存在: " + stockCode);
        }
        
        Stock stock = stockOpt.get();
        return convertToStockQuoteDTO(stock);
    }
    
    @Override
    public List<StockQuoteDTO> getAllActiveStocks() {
        List<Stock> stocks = stockRepository.findByIsActiveTrue();
        List<StockQuoteDTO> result = new ArrayList<>();
        
        for (Stock stock : stocks) {
            result.add(convertToStockQuoteDTO(stock));
        }
        
        return result;
    }
    
    @Override
    public List<StockQuoteDTO> searchStocks(String keyword) {
        List<Stock> stocks = stockRepository.searchByKeyword(keyword);
        List<StockQuoteDTO> result = new ArrayList<>();
        
        for (Stock stock : stocks) {
            result.add(convertToStockQuoteDTO(stock));
        }
        
        return result;
    }
    
    @Override
    public List<StockQuoteDTO> getTopGainersAndLosers() {
        List<Stock> stocks = stockRepository.findTopGainersAndLosers();
        List<StockQuoteDTO> result = new ArrayList<>();
        
        for (Stock stock : stocks) {
            result.add(convertToStockQuoteDTO(stock));
        }
        
        return result;
    }
    
    @Override
    @Transactional
    public TradeResultDTO executeTrade(TradeRequestDTO tradeRequest) {
        try {
            // 验证股票是否存在
            Optional<Stock> stockOpt = stockRepository.findByCode(tradeRequest.getStockCode());
            if (stockOpt.isEmpty()) {
                return createTradeResult(false, "股票代码不存在: " + tradeRequest.getStockCode());
            }
            
            Stock stock = stockOpt.get();
            BigDecimal currentPrice = stock.getCurrentPrice();
            BigDecimal tradePrice = tradeRequest.getPrice();
            
            // 市价单使用当前价格
            if (tradeRequest.getOrderType() == TradeRequestDTO.OrderType.MARKET) {
                tradePrice = currentPrice;
            }
            
            // 计算交易总金额
            BigDecimal totalAmount = tradePrice.multiply(BigDecimal.valueOf(tradeRequest.getQuantity()));
            
            // 创建交易记录
            TradeRecord tradeRecord = new TradeRecord();
            tradeRecord.setUserId(tradeRequest.getUserId());
            tradeRecord.setStock(stock);
            tradeRecord.setTradeType(TradeRecord.TradeType.valueOf(tradeRequest.getTradeType().name()));
            tradeRecord.setQuantity(tradeRequest.getQuantity());
            tradeRecord.setPrice(tradePrice);
            tradeRecord.setTotalAmount(totalAmount);
            tradeRecord.setOrderType(TradeRecord.OrderType.valueOf(tradeRequest.getOrderType().name()));
            tradeRecord.setStatus(TradeRecord.TradeStatus.COMPLETED);
            tradeRecord.setTradeTime(LocalDateTime.now());
            
            tradeRecordRepository.save(tradeRecord);
            
            // 更新用户持仓
            updateUserPosition(tradeRequest.getUserId(), stock, tradeRequest.getTradeType(), 
                              tradeRequest.getQuantity(), tradePrice);
            
            log.info("用户 {} 成功{}股票 {} {}股，价格: {}", 
                    tradeRequest.getUserId(), 
                    tradeRequest.getTradeType() == TradeRequestDTO.TradeType.BUY ? "买入" : "卖出",
                    tradeRequest.getStockCode(), 
                    tradeRequest.getQuantity(), 
                    tradePrice);
            
            return createTradeResult(true, "交易成功", tradeRecord);
            
        } catch (Exception e) {
            log.error("交易执行失败: {}", e.getMessage(), e);
            return createTradeResult(false, "交易失败: " + e.getMessage());
        }
    }
    
    @Override
    public List<UserPosition> getUserPositions(String userId) {
        return userPositionRepository.findByUserId(userId);
    }
    
    @Override
    public List<TradeRecord> getTradeHistory(String userId, int days) {
        LocalDateTime endTime = LocalDateTime.now();
        LocalDateTime startTime = endTime.minusDays(days);
        return tradeRecordRepository.findByUserIdAndTradeTimeBetweenOrderByTradeTimeDesc(userId, startTime, endTime);
    }
    
    @Override
    public List<StockPriceHistory> getStockPriceHistory(String stockCode, int days) {
        Optional<Stock> stockOpt = stockRepository.findByCode(stockCode);
        if (stockOpt.isEmpty()) {
            throw new RuntimeException("股票代码不存在: " + stockCode);
        }
        
        LocalDateTime endTime = LocalDateTime.now();
        LocalDateTime startTime = endTime.minusDays(days);
        
        return priceHistoryRepository.findByStockIdAndTimestampBetween(
                stockOpt.get().getId(), startTime, endTime);
    }
    
    @Override
    public BigDecimal getUserTotalAssets(String userId) {
        BigDecimal totalAssets = userPositionRepository.getTotalPortfolioValue(userId);
        return totalAssets != null ? totalAssets : BigDecimal.ZERO;
    }
    
    /**
     * 转换股票实体为DTO
     */
    private StockQuoteDTO convertToStockQuoteDTO(Stock stock) {
        StockQuoteDTO dto = new StockQuoteDTO();
        dto.setCode(stock.getCode());
        dto.setName(stock.getName());
        dto.setCompany(stock.getCompany());
        dto.setCurrentPrice(stock.getCurrentPrice());
        dto.setPreviousClose(stock.getPreviousClose());
        
        // 计算涨跌幅
        BigDecimal change = stock.getCurrentPrice().subtract(stock.getPreviousClose());
        BigDecimal changePercent = change.divide(stock.getPreviousClose(), 4, RoundingMode.HALF_UP)
                                        .multiply(BigDecimal.valueOf(100));
        
        dto.setChange(change);
        dto.setChangePercent(changePercent);
        dto.setOpenPrice(stock.getOpenPrice());
        dto.setHighPrice(stock.getHighPrice());
        dto.setLowPrice(stock.getLowPrice());
        dto.setVolume(stock.getVolume());
        dto.setMarketCap(stock.getMarketCap());
        dto.setIndustry(stock.getIndustry());
        dto.setIsActive(stock.getIsActive());
        
        return dto;
    }
    
    /**
     * 更新用户持仓
     */
    private void updateUserPosition(String userId, Stock stock, TradeRequestDTO.TradeType tradeType, 
                                   Integer quantity, BigDecimal price) {
        Optional<UserPosition> positionOpt = userPositionRepository.findByUserIdAndStockId(userId, stock.getId());
        UserPosition position;
        
        if (positionOpt.isPresent()) {
            position = positionOpt.get();
        } else {
            position = new UserPosition();
            position.setUserId(userId);
            position.setStock(stock);
            position.setQuantity(0);
            position.setAveragePrice(BigDecimal.ZERO);
            position.setCurrentValue(BigDecimal.ZERO);
            position.setProfitLoss(BigDecimal.ZERO);
        }
        
        if (tradeType == TradeRequestDTO.TradeType.BUY) {
            // 买入：计算新的平均成本
            int newQuantity = position.getQuantity() + quantity;
            BigDecimal newTotalCost = position.getAveragePrice().multiply(BigDecimal.valueOf(position.getQuantity()))
                                      .add(price.multiply(BigDecimal.valueOf(quantity)));
            BigDecimal newAveragePrice = newTotalCost.divide(BigDecimal.valueOf(newQuantity), 2, RoundingMode.HALF_UP);
            
            position.setQuantity(newQuantity);
            position.setAveragePrice(newAveragePrice);
        } else {
            // 卖出：减少持仓数量
            int newQuantity = position.getQuantity() - quantity;
            if (newQuantity < 0) {
                throw new RuntimeException("持仓数量不足");
            }
            position.setQuantity(newQuantity);
        }
        
        // 更新当前市值和盈亏
        BigDecimal currentValue = stock.getCurrentPrice().multiply(BigDecimal.valueOf(position.getQuantity()));
        BigDecimal profitLoss = currentValue.subtract(
            position.getAveragePrice().multiply(BigDecimal.valueOf(position.getQuantity())));
        
        position.setCurrentValue(currentValue);
        position.setProfitLoss(profitLoss);
        
        userPositionRepository.save(position);
    }
    
    /**
     * 创建交易结果
     */
    private TradeResultDTO createTradeResult(boolean success, String message) {
        return createTradeResult(success, message, null);
    }
    
    private TradeResultDTO createTradeResult(boolean success, String message, TradeRecord tradeRecord) {
        TradeResultDTO result = new TradeResultDTO();
        result.setStatus(success ? TradeResultDTO.TradeStatus.SUCCESS : TradeResultDTO.TradeStatus.FAILED);
        result.setMessage(message);
        
        if (tradeRecord != null) {
            result.setTradeId(tradeRecord.getId());
            result.setStockCode(tradeRecord.getStock().getCode());
            result.setStockName(tradeRecord.getStock().getName());
            result.setTradeType(TradeRequestDTO.TradeType.valueOf(tradeRecord.getTradeType().name()));
            result.setQuantity(tradeRecord.getQuantity());
            result.setPrice(tradeRecord.getPrice());
            result.setTotalAmount(tradeRecord.getTotalAmount());
            result.setTradeTime(tradeRecord.getTradeTime());
        }
        
        return result;
    }
}