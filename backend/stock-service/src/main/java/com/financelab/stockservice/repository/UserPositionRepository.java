package com.financelab.stockservice.repository;

import com.financelab.stockservice.entity.UserPosition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserPositionRepository extends JpaRepository<UserPosition, Long> {
    
    List<UserPosition> findByUserId(String userId);
    
    Optional<UserPosition> findByUserIdAndStockId(String userId, Long stockId);
    
    @Query("SELECT SUM(up.currentValue) FROM UserPosition up WHERE up.userId = :userId")
    BigDecimal getTotalPortfolioValue(@Param("userId") String userId);
    
    @Query("SELECT up FROM UserPosition up WHERE up.userId = :userId AND up.quantity > 0 ORDER BY up.currentValue DESC")
    List<UserPosition> findActivePositions(@Param("userId") String userId);
}