package com.financelab.mallservice.repository;

import com.financelab.mallservice.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    Optional<Product> findByProductCode(String productCode);
    
    List<Product> findByCategory(Product.ProductCategory category);
    
    Page<Product> findByCategory(Product.ProductCategory category, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.status = 'AVAILABLE' ORDER BY p.salesCount DESC")
    List<Product> findTopSellingProducts(Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.status = 'AVAILABLE' ORDER BY p.rating DESC")
    List<Product> findTopRatedProducts(Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.status = 'AVAILABLE' AND p.price BETWEEN :minPrice AND :maxPrice")
    Page<Product> findByPriceRange(@Param("minPrice") BigDecimal minPrice, 
                                   @Param("maxPrice") BigDecimal maxPrice, 
                                   Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE (p.productName LIKE %:keyword% OR p.description LIKE %:keyword%) AND p.status = 'AVAILABLE'")
    Page<Product> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.status = 'AVAILABLE' AND p.discount > 0 ORDER BY p.discount DESC")
    List<Product> findDiscountedProducts(Pageable pageable);
    
    boolean existsByProductCode(String productCode);
}
