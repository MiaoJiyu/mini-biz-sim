package com.financelab.bankservice.repository;

import com.financelab.bankservice.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findByFromAccountNumber(String accountNumber);
    
    List<Transaction> findByToAccountNumber(String accountNumber);
    
    @Query("SELECT t FROM Transaction t WHERE t.fromAccountNumber = :accountNumber OR t.toAccountNumber = :accountNumber")
    List<Transaction> findByAccountNumber(@Param("accountNumber") String accountNumber);
    
    @Query("SELECT t FROM Transaction t WHERE (t.fromAccountNumber = :accountNumber OR t.toAccountNumber = :accountNumber) AND t.transactionTime BETWEEN :startDate AND :endDate")
    List<Transaction> findByAccountNumberAndDateRange(@Param("accountNumber") String accountNumber, 
                                                     @Param("startDate") LocalDateTime startDate, 
                                                     @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.toAccountNumber = :accountNumber AND t.type = 'DEPOSIT' AND t.status = 'COMPLETED'")
    Optional<Double> getTotalDeposits(@Param("accountNumber") String accountNumber);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.fromAccountNumber = :accountNumber AND t.type = 'WITHDRAWAL' AND t.transactionTime >= :date")
    long countRecentWithdrawals(@Param("accountNumber") String accountNumber, 
                               @Param("date") LocalDateTime date);
}