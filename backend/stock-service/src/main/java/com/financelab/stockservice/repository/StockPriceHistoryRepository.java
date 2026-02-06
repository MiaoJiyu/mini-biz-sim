package com.financelab.stockservice.repository;

import com.financelab.stockservice.entity.StockPriceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StockPriceHistoryRepository extends JpaRepository<StockPriceHistory, Long> {
    
    List<StockPriceHistory> findByStockIdOrderByTimestampDesc(Long stockId);
    
    @Query("SELECT sph FROM StockPriceHistory sph WHERE sph.stock.id = :stockId AND sph.timestamp BETWEEN :startTime AND :endTime ORDER BY sph.timestamp ASC")
    List<StockPriceHistory> findByStockIdAndTimestampBetween(
            @Param("stockId") Long stockId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);
    
    @Query("SELECT sph FROM StockPriceHistory sph WHERE sph.stock.id = :stockId AND sph.type = 'CLOSE' ORDER BY sph.timestamp DESC LIMIT 30")
    List<StockPriceHistory> findLast30DaysClosePrices(@Param("stockId") Long stockId);
}