package com.financelab.stockservice.repository;

import com.financelab.stockservice.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
    
    Optional<Stock> findByCode(String code);
    
    List<Stock> findByIsActiveTrue();
    
    List<Stock> findByIndustry(String industry);
    
    @Query("SELECT s FROM Stock s WHERE s.name LIKE %:keyword% OR s.company LIKE %:keyword% OR s.code LIKE %:keyword%")
    List<Stock> searchByKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT s FROM Stock s WHERE s.isActive = true ORDER BY ABS((s.currentPrice - s.previousClose) / s.previousClose * 100) DESC")
    List<Stock> findTopGainersAndLosers();
}