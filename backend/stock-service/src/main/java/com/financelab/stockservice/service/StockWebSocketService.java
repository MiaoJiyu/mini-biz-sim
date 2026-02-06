package com.financelab.stockservice.service;

import com.financelab.stockservice.dto.StockQuoteDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class StockWebSocketService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Autowired
    private StockService stockService;
    
    @Autowired
    private StockPriceSimulator priceSimulator;
    
    private final ConcurrentHashMap<String, Long> lastUpdateTimes = new ConcurrentHashMap<>();

    /**
     * 每3秒推送一次活跃股票的实时价格
     */
    @Scheduled(fixedRate = 3000)
    public void broadcastStockPrices() {
        try {
            List<StockQuoteDTO> activeStocks = stockService.getAllActiveStocks();
            
            // 推送所有活跃股票的实时价格
            messagingTemplate.convertAndSend("/topic/stock-prices", activeStocks);
            
            // 推送涨跌幅排行榜
            List<StockQuoteDTO> topStocks = stockService.getTopGainersAndLosers();
            messagingTemplate.convertAndSend("/topic/top-stocks", topStocks);
            
            log.debug("已推送 {} 只股票的实时价格", activeStocks.size());
            
        } catch (Exception e) {
            log.error("推送股票价格失败: {}", e.getMessage(), e);
        }
    }

    /**
     * 推送单个股票的实时价格
     */
    public void sendStockPrice(String stockCode) {
        try {
            StockQuoteDTO quote = stockService.getStockQuote(stockCode);
            messagingTemplate.convertAndSend("/topic/stock-price/" + stockCode, quote);
        } catch (Exception e) {
            log.error("推送股票 {} 价格失败: {}", stockCode, e.getMessage());
        }
    }

    /**
     * 推送交易确认消息
     */
    public void sendTradeConfirmation(String userId, Object tradeResult) {
        messagingTemplate.convertAndSendToUser(userId, "/queue/trade-confirmations", tradeResult);
    }

    /**
     * 推送系统公告
     */
    public void broadcastSystemMessage(String message) {
        messagingTemplate.convertAndSend("/topic/system-messages", message);
    }
}