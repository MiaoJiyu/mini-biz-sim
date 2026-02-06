package com.financelab.stockservice.service;

import com.financelab.stockservice.dto.StockQuoteDTO;
import com.financelab.stockservice.dto.TradeRequestDTO;
import com.financelab.stockservice.dto.TradeResultDTO;
import com.financelab.stockservice.entity.StockPriceHistory;
import com.financelab.stockservice.entity.TradeRecord;
import com.financelab.stockservice.entity.UserPosition;

import java.util.List;

public interface StockService {
    
    /**
     * 获取股票实时行情
     */
    StockQuoteDTO getStockQuote(String stockCode);
    
    /**
     * 获取所有活跃股票列表
     */
    List<StockQuoteDTO> getAllActiveStocks();
    
    /**
     * 搜索股票
     */
    List<StockQuoteDTO> searchStocks(String keyword);
    
    /**
     * 获取涨跌幅排行榜
     */
    List<StockQuoteDTO> getTopGainersAndLosers();
    
    /**
     * 执行股票交易
     */
    TradeResultDTO executeTrade(TradeRequestDTO tradeRequest);
    
    /**
     * 获取用户持仓
     */
    List<UserPosition> getUserPositions(String userId);
    
    /**
     * 获取用户交易记录
     */
    List<TradeRecord> getTradeHistory(String userId, int days);
    
    /**
     * 获取股票价格历史数据
     */
    List<StockPriceHistory> getStockPriceHistory(String stockCode, int days);
    
    /**
     * 获取用户总资产
     */
    BigDecimal getUserTotalAssets(String userId);
}