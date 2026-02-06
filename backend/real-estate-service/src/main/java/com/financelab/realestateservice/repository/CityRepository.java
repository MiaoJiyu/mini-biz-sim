package com.financelab.realestateservice.repository;

import com.financelab.realestateservice.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {
    
    Optional<City> findByName(String name);
    
    List<City> findByRegion(String region);
    
    @Query("SELECT c FROM City c WHERE c.economicDevelopmentLevel >= :level ORDER BY c.growthRate DESC")
    List<City> findCitiesByEconomicLevel(@Param("level") Integer level);
    
    @Query("SELECT c FROM City c ORDER BY c.growthRate DESC LIMIT 5")
    List<City> findTopGrowthCities();
}