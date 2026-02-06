package com.financelab.userservice.repository;

import com.financelab.userservice.entity.RolePermission;
import com.financelab.userservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, Long> {
    
    List<RolePermission> findByRole(User.UserRole role);
    
    List<RolePermission> findByRoleAndIsEnabledTrue(User.UserRole role);
    
    @Query("SELECT rp FROM RolePermission rp WHERE rp.role = :role AND rp.permissionCode = :permissionCode")
    Optional<RolePermission> findByRoleAndPermissionCode(@Param("role") User.UserRole role, 
                                                        @Param("permissionCode") String permissionCode);
    
    @Query("SELECT rp FROM RolePermission rp WHERE rp.isEnabled = true")
    List<RolePermission> findAllEnabledPermissions();
}