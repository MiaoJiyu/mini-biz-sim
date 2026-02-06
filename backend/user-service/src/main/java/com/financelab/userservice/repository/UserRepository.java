package com.financelab.userservice.repository;

import com.financelab.userservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    Boolean existsByUsername(String username);
    
    Boolean existsByEmail(String email);
    
    List<User> findByRole(User.UserRole role);
    
    List<User> findBySchoolId(Long schoolId);
    
    List<User> findByClassId(Long classId);
    
    @Query("SELECT u FROM User u WHERE u.role = :role AND u.schoolId = :schoolId")
    List<User> findByRoleAndSchoolId(@Param("role") User.UserRole role, @Param("schoolId") Long schoolId);
    
    @Query("SELECT u FROM User u WHERE u.isActive = true")
    List<User> findActiveUsers();
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    Long countByRole(@Param("role") User.UserRole role);
    
    @Query("SELECT u FROM User u WHERE u.totalAssets >= :minAssets ORDER BY u.totalAssets DESC")
    List<User> findTopUsersByAssets(@Param("minAssets") Double minAssets);
}