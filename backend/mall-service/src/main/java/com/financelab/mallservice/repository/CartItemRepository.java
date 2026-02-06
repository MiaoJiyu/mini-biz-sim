package com.financelab.mallservice.repository;

import com.financelab.mallservice.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    
    List<CartItem> findByUserId(String userId);
    
    Optional<CartItem> findByUserIdAndProductId(String userId, Long productId);
    
    @Query("SELECT SUM(c.totalPrice) FROM CartItem c WHERE c.userId = :userId")
    Optional<BigDecimal> getTotalAmountByUserId(@Param("userId") String userId);
    
    @Query("SELECT COUNT(c) FROM CartItem c WHERE c.userId = :userId")
    long countByUserId(@Param("userId") String userId);
    
    void deleteByUserId(String userId);
    
    void deleteByUserIdAndProductId(String userId, Long productId);
}
