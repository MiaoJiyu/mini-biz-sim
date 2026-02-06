package com.financelab.mallservice.repository;

import com.financelab.mallservice.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    Optional<Order> findByOrderNumber(String orderNumber);
    
    List<Order> findByUserId(String userId);
    
    Page<Order> findByUserId(String userId, Pageable pageable);
    
    Page<Order> findByUserIdAndStatus(String userId, Order.OrderStatus status, Pageable pageable);
    
    @Query("SELECT o FROM Order o WHERE o.userId = :userId AND o.createdAt BETWEEN :startDate AND :endDate")
    List<Order> findByUserIdAndDateRange(@Param("userId") String userId,
                                         @Param("startDate") LocalDateTime startDate,
                                         @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT SUM(o.finalAmount) FROM Order o WHERE o.userId = :userId AND o.status != 'CANCELLED' AND o.status != 'REFUNDED'")
    Optional<BigDecimal> getTotalSpentByUserId(@Param("userId") String userId);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.userId = :userId")
    long countByUserId(@Param("userId") String userId);
    
    @Query("SELECT o.status, COUNT(o) FROM Order o WHERE o.userId = :userId GROUP BY o.status")
    List<Object[]> countOrdersByStatus(@Param("userId") String userId);
}
