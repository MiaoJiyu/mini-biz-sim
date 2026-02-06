package com.financelab.realestateservice.repository;

import com.financelab.realestateservice.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    
    List<Property> findByCityId(Long cityId);
    
    List<Property> findByType(String type);
    
    List<Property> findByIsForSaleTrue();
    
    List<Property> findByOwnerId(String ownerId);
    
    List<Property> findByIsForSaleTrueAndCityId(Long cityId);
    
    @Query("SELECT p FROM Property p WHERE p.isForSale = true AND p.currentPrice BETWEEN :minPrice AND :maxPrice")
    List<Property> findPropertiesByPriceRange(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);
    
    @Query("SELECT p FROM Property p WHERE p.ownerId = :ownerId AND p.isRented = false")
    List<Property> findAvailablePropertiesForRentByOwner(@Param("ownerId") String ownerId);
    
    @Query("SELECT p FROM Property p WHERE p.isForSale = true ORDER BY p.currentPrice ASC")
    List<Property> findPropertiesByPriceAsc();
    
    @Query("SELECT p FROM Property p WHERE p.isForSale = true ORDER BY p.currentPrice DESC")
    List<Property> findPropertiesByPriceDesc();
}