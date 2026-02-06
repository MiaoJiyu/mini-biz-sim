package com.financelab.userservice.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "role_permissions")
public class RolePermission {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private User.UserRole role;
    
    @Column(nullable = false)
    private String permissionCode;
    
    @Column(nullable = false)
    private String permissionName;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "is_enabled")
    private Boolean isEnabled = true;
}