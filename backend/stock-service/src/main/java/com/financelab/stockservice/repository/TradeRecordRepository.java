package com.financelab.stockservice.repository;

import com.financelab.stockservice.entity.TradeRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TradeRecordRepository extends JpaRepository<TradeRecord, Long> {
    
    List<TradeRecord> findByUserIdOrderByTradeTimeDesc(String userId);
    
    List<TradeRecord> findByUserIdAndTradeTimeBetweenOrderByTradeTimeDesc(
            String userId, LocalDateTime startTime, LocalDateTime endTime);
    
    @Query("SELECT tr FROM TradeRecord tr WHERE tr.stock.id = :stockId AND tr.tradeTime BETWEEN :startTime AND :endTime ORDER BY tr.tradeTime DESC")
    List<TradeRecord> findRecentTradesByStockId(
            @Param("stockId") Long stockId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);
    
    @Query("SELECT COUNT(tr) FROM TradeRecord tr WHERE tr.userId = :userId AND tr.tradeTime BETWEEN :startTime AND :endTime")
    Long countUserTradesInPeriod(
            @Param("userId") String userId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);
}