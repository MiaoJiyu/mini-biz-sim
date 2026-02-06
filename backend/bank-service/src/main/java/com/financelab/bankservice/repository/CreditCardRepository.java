package com.financelab.bankservice.repository;

import com.financelab.bankservice.entity.CreditCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CreditCardRepository extends JpaRepository<CreditCard, Long> {
    
    List<CreditCard> findByUserId(String userId);
    
    Optional<CreditCard> findByCardNumber(String cardNumber);
    
    @Query("SELECT SUM(c.usedLimit) FROM CreditCard c WHERE c.userId = :userId AND c.status = 'ACTIVE'")
    Optional<Double> getTotalUsedLimitByUserId(@Param("userId") String userId);
    
    @Query("SELECT SUM(c.creditLimit) FROM CreditCard c WHERE c.userId = :userId AND c.status = 'ACTIVE'")
    Optional<Double> getTotalCreditLimitByUserId(@Param("userId") String userId);
    
    boolean existsByCardNumber(String cardNumber);
    
    List<CreditCard> findByStatus(CreditCard.CardStatus status);
}
