package com.financelab.bankservice.repository;

import com.financelab.bankservice.entity.UserInvestment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserInvestmentRepository extends JpaRepository<UserInvestment, Long> {
    
    List<UserInvestment> findByUserId(String userId);
    
    Optional<UserInvestment> findByUserIdAndProductId(String userId, Long productId);
    
    @Query("SELECT SUM(u.investmentAmount) FROM UserInvestment u WHERE u.userId = :userId AND u.status = 'ACTIVE'")
    Optional<Double> getTotalInvestmentAmountByUserId(@Param("userId") String userId);
    
    @Query("SELECT SUM(u.accumulatedReturn) FROM UserInvestment u WHERE u.userId = :userId")
    Optional<Double> getTotalAccumulatedReturnByUserId(@Param("userId") String userId);
    
    @Query("SELECT u FROM UserInvestment u WHERE u.userId = :userId AND u.status = 'ACTIVE'")
    List<UserInvestment> findActiveInvestmentsByUserId(@Param("userId") String userId);
    
    @Query("SELECT u FROM UserInvestment u WHERE u.status = 'MATURED'")
    List<UserInvestment> findMaturedInvestments();
}
