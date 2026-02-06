package com.financelab.stockservice.controller;

import com.financelab.stockservice.dto.StockQuoteDTO;
import com.financelab.stockservice.dto.TradeRequestDTO;
import com.financelab.stockservice.dto.TradeResultDTO;
import com.financelab.stockservice.entity.StockPriceHistory;
import com.financelab.stockservice.entity.TradeRecord;
import com.financelab.stockservice.entity.UserPosition;
import com.financelab.stockservice.service.StockService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@Slf4j
public class StockController {

    @Autowired
    private StockService stockService;

    /**
     * 获取所有活跃股票列表
     */
    @GetMapping("/active")
    public ResponseEntity<List<StockQuoteDTO>> getActiveStocks() {
        try {
            List<StockQuoteDTO> stocks = stockService.getAllActiveStocks();
            return ResponseEntity.ok(stocks);
        } catch (Exception e) {
            log.error("获取活跃股票列表失败: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 获取股票实时行情
     */
    @GetMapping("/{stockCode}")
    public ResponseEntity<StockQuoteDTO> getStockQuote(@PathVariable String stockCode) {
        try {
            StockQuoteDTO quote = stockService.getStockQuote(stockCode);
            return ResponseEntity.ok(quote);
        } catch (Exception e) {
            log.error("获取股票行情失败: {}", e.getMessage(), e);
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 搜索股票
     */
    @GetMapping("/search")
    public ResponseEntity<List<StockQuoteDTO>> searchStocks(@RequestParam String keyword) {
        try {
            List<StockQuoteDTO> stocks = stockService.searchStocks(keyword);
            return ResponseEntity.ok(stocks);
        } catch (Exception e) {
            log.error("搜索股票失败: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 获取涨跌幅排行榜
     */
    @GetMapping("/top")
    public ResponseEntity<List<StockQuoteDTO>> getTopGainersAndLosers() {
        try {
            List<StockQuoteDTO> topStocks = stockService.getTopGainersAndLosers();
            return ResponseEntity.ok(topStocks);
        } catch (Exception e) {
            log.error("获取排行榜失败: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 执行股票交易
     */
    @PostMapping("/trade")
    public ResponseEntity<TradeResultDTO> executeTrade(@RequestBody TradeRequestDTO tradeRequest) {
        try {
            TradeResultDTO result = stockService.executeTrade(tradeRequest);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("交易执行失败: {}", e.getMessage(), e);
            TradeResultDTO errorResult = new TradeResultDTO();
            errorResult.setStatus(TradeResultDTO.TradeStatus.FAILED);
            errorResult.setMessage("交易失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResult);
        }
    }

    /**
     * 获取用户持仓
     */
    @GetMapping("/positions/{userId}")
    public ResponseEntity<List<UserPosition>> getUserPositions(@PathVariable String userId) {
        try {
            List<UserPosition> positions = stockService.getUserPositions(userId);
            return ResponseEntity.ok(positions);
        } catch (Exception e) {
            log.error("获取用户持仓失败: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 获取用户交易记录
     */
    @GetMapping("/history/{userId}")
    public ResponseEntity<List<TradeRecord>> getTradeHistory(
            @PathVariable String userId,
            @RequestParam(defaultValue = "30") int days) {
        try {
            List<TradeRecord> history = stockService.getTradeHistory(userId, days);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            log.error("获取交易记录失败: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 获取股票价格历史数据
     */
    @GetMapping("/{stockCode}/history")
    public ResponseEntity<List<StockPriceHistory>> getStockPriceHistory(
            @PathVariable String stockCode,
            @RequestParam(defaultValue = "30") int days) {
        try {
            List<StockPriceHistory> history = stockService.getStockPriceHistory(stockCode, days);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            log.error("获取价格历史失败: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 获取用户总资产
     */
    @GetMapping("/assets/{userId}")
    public ResponseEntity<BigDecimal> getUserTotalAssets(@PathVariable String userId) {
        try {
            BigDecimal totalAssets = stockService.getUserTotalAssets(userId);
            return ResponseEntity.ok(totalAssets);
        } catch (Exception e) {
            log.error("获取用户资产失败: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
}