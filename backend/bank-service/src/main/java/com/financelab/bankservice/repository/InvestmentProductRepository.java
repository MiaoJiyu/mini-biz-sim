package com.financelab.bankservice.repository;

import com.financelab.bankservice.entity.InvestmentProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvestmentProductRepository extends JpaRepository<InvestmentProduct, Long> {
    
    Optional<InvestmentProduct> findByProductCode(String productCode);
    
    @Query("SELECT p FROM InvestmentProduct p WHERE p.status = 'AVAILABLE' ORDER BY p.expectedReturnRate DESC")
    List<InvestmentProduct> findAvailableProductsSortedByReturn();
    
    @Query("SELECT p FROM InvestmentProduct p WHERE p.productType = :type AND p.status = 'AVAILABLE'")
    List<InvestmentProduct> findByProductTypeAndAvailable(@Param("type") InvestmentProduct.ProductType type);
    
    @Query("SELECT p FROM InvestmentProduct p WHERE p.riskLevel <= :maxRisk AND p.status = 'AVAILABLE'")
    List<InvestmentProduct> findByRiskLevelLessThanOrEqual(@Param("maxRisk") BigDecimal maxRisk);
    
    boolean existsByProductCode(String productCode);
}
