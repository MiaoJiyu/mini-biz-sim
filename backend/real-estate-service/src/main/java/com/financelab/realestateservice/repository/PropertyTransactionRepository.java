package com.financelab.realestateservice.repository;

import com.financelab.realestateservice.entity.PropertyTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PropertyTransactionRepository extends JpaRepository<PropertyTransaction, Long> {
    
    List<PropertyTransaction> findByBuyerId(String buyerId);
    
    List<PropertyTransaction> findBySellerId(String sellerId);
    
    List<PropertyTransaction> findByPropertyId(Long propertyId);
    
    @Query("SELECT pt FROM PropertyTransaction pt WHERE pt.buyerId = :userId OR pt.sellerId = :userId ORDER BY pt.transactionDate DESC")
    List<PropertyTransaction> findUserTransactionHistory(@Param("userId") String userId);
    
    @Query("SELECT pt FROM PropertyTransaction pt WHERE pt.transactionDate BETWEEN :startDate AND :endDate AND pt.status = 'COMPLETED'")
    List<PropertyTransaction> findCompletedTransactionsInPeriod(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT pt FROM PropertyTransaction pt WHERE pt.type = 'RENT' AND pt.rentalEndDate < :currentDate AND pt.status = 'COMPLETED'")
    List<PropertyTransaction> findExpiredRentals(@Param("currentDate") LocalDateTime currentDate);
}