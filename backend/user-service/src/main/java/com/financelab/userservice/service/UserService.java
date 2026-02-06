package com.financelab.userservice.service;

import com.financelab.userservice.dto.LoginRequest;
import com.financelab.userservice.dto.RegisterRequest;
import com.financelab.userservice.dto.UpdateUserRequest;
import com.financelab.userservice.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    
    User register(RegisterRequest request);
    
    String login(LoginRequest request);
    
    Optional<User> getUserById(Long id);
    
    Optional<User> getUserByUsername(String username);
    
    Optional<User> getUserByEmail(String email);
    
    User updateUser(Long id, UpdateUserRequest request);
    
    void deleteUser(Long id);
    
    List<User> getUsersByRole(User.UserRole role);
    
    List<User> getUsersBySchoolId(Long schoolId);
    
    List<User> getUsersByClassId(Long classId);
    
    List<User> getTopUsersByAssets(Double minAssets);
    
    User updateUserAssets(Long userId, Double amount);
    
    User updateUserLevel(Long userId, Integer level);
    
    User updateUserCreditScore(Long userId, Integer score);
    
    Long getActiveUserCount();
    
    Long getUserCountByRole(User.UserRole role);
    
    boolean validateToken(String token);
    
    User getUserFromToken(String token);
}