package com.financelab.bankservice.repository;

import com.financelab.bankservice.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {
    
    List<Loan> findByUserId(String userId);
    
    List<Loan> findByUserIdAndStatus(String userId, Loan.LoanStatus status);
    
    List<Loan> findByStatus(Loan.LoanStatus status);
    
    @Query("SELECT SUM(l.remainingAmount) FROM Loan l WHERE l.userId = :userId AND l.status IN :statuses")
    Optional<Double> getTotalLoanAmountByUserIdAndStatus(@Param("userId") String userId, 
                                                        @Param("statuses") List<Loan.LoanStatus> statuses);
    
    @Query("SELECT l FROM Loan l WHERE l.nextPaymentDate <= :date AND l.status = 'ACTIVE'")
    List<Loan> findLoansDueForPayment(@Param("date") LocalDateTime date);
    
    @Query("SELECT COUNT(l) FROM Loan l WHERE l.userId = :userId AND l.status = 'PAID_OFF'")
    long countPaidOffLoansByUserId(@Param("userId") String userId);
    
    @Query("SELECT l FROM Loan l WHERE l.status = 'DELINQUENT' AND l.overdueDays > 0")
    List<Loan> findDelinquentLoans();
}