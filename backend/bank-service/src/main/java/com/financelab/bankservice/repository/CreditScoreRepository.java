package com.financelab.bankservice.repository;

import com.financelab.bankservice.entity.CreditScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CreditScoreRepository extends JpaRepository<CreditScore, Long> {
    
    Optional<CreditScore> findByUserId(String userId);
    
    @Query("SELECT AVG(cs.score) FROM CreditScore cs WHERE cs.score > 0")
    Optional<Double> getAverageCreditScore();
    
    @Query("SELECT COUNT(cs) FROM CreditScore cs WHERE cs.score >= :minScore")
    long countByScoreGreaterThanEqual(@Param("minScore") int minScore);
    
    @Query("SELECT cs.rating, COUNT(cs) FROM CreditScore cs GROUP BY cs.rating")
    List<Object[]> countByRating();
}