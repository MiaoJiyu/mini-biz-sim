package com.financelab.bankservice.repository;

import com.financelab.bankservice.entity.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {
    
    List<BankAccount> findByUserId(String userId);
    
    Optional<BankAccount> findByAccountNumber(String accountNumber);
    
    Optional<BankAccount> findByUserIdAndAccountType(String userId, BankAccount.AccountType accountType);
    
    @Query("SELECT SUM(b.balance) FROM BankAccount b WHERE b.userId = :userId AND b.isActive = true")
    Optional<Double> getTotalBalanceByUserId(@Param("userId") String userId);
    
    boolean existsByAccountNumber(String accountNumber);
    
    List<BankAccount> findByIsActiveTrue();
}