package com.financelab.realestateservice.repository;

import com.financelab.realestateservice.entity.PropertyPriceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PropertyPriceHistoryRepository extends JpaRepository<PropertyPriceHistory, Long> {
    
    List<PropertyPriceHistory> findByPropertyIdOrderByPriceDateDesc(Long propertyId);
    
    @Query("SELECT pph FROM PropertyPriceHistory pph WHERE pph.property.id = :propertyId AND pph.priceDate >= :startDate ORDER BY pph.priceDate ASC")
    List<PropertyPriceHistory> findPriceHistoryByPropertyAndDateRange(@Param("propertyId") Long propertyId, @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT pph FROM PropertyPriceHistory pph WHERE pph.property.id = :propertyId ORDER BY pph.priceDate DESC LIMIT 30")
    List<PropertyPriceHistory> findRecentPriceHistory(@Param("propertyId") Long propertyId);
    
    @Query("SELECT pph FROM PropertyPriceHistory pph WHERE pph.priceDate = (SELECT MAX(pph2.priceDate) FROM PropertyPriceHistory pph2 WHERE pph2.property.id = pph.property.id)")
    List<PropertyPriceHistory> findLatestPricesForAllProperties();
}