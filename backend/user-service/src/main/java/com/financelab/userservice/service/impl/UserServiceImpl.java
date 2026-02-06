package com.financelab.userservice.service.impl;

import com.financelab.userservice.dto.LoginRequest;
import com.financelab.userservice.dto.RegisterRequest;
import com.financelab.userservice.dto.UpdateUserRequest;
import com.financelab.userservice.entity.User;
import com.financelab.userservice.repository.UserRepository;
import com.financelab.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    
    @Override
    @Transactional
    public User register(RegisterRequest request) {
        // 检查用户名和邮箱是否已存在
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("用户名已存在");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("邮箱已被注册");
        }
        
        // 创建新用户
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setNickname(request.getNickname() != null ? request.getNickname() : request.getUsername());
        user.setSchoolId(request.getSchoolId());
        user.setClassId(request.getClassId());
        user.setCashBalance(BigDecimal.valueOf(10000)); // 初始资金10000金币
        user.setTotalAssets(BigDecimal.valueOf(10000));
        user.setCreditScore(100);
        user.setLevel(1);
        user.setIsActive(true);
        
        User savedUser = userRepository.save(user);
        log.info("用户注册成功: {}", savedUser.getUsername());
        return savedUser;
    }
    
    @Override
    public String login(LoginRequest request) {
        // 查找用户（支持用户名或邮箱登录）
        Optional<User> userOptional = userRepository.findByUsername(request.getUsername());
        if (userOptional.isEmpty()) {
            userOptional = userRepository.findByEmail(request.getUsername());
        }
        
        if (userOptional.isEmpty()) {
            throw new RuntimeException("用户不存在");
        }
        
        User user = userOptional.get();
        
        // 验证密码
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("密码错误");
        }
        
        // 检查用户是否激活
        if (!user.getIsActive()) {
            throw new RuntimeException("用户账户已被禁用");
        }
        
        // 更新最后登录时间
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        
        // 生成JWT token
        String token = jwtTokenProvider.generateToken(user);
        log.info("用户登录成功: {}", user.getUsername());
        return token;
    }
    
    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    @Override
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    @Override
    @Transactional
    public User updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        if (request.getNickname() != null) {
            user.setNickname(request.getNickname());
        }
        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar());
        }
        if (request.getSchoolId() != null) {
            user.setSchoolId(request.getSchoolId());
        }
        if (request.getClassId() != null) {
            user.setClassId(request.getClassId());
        }
        
        return userRepository.save(user);
    }
    
    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        user.setIsActive(false);
        userRepository.save(user);
        log.info("用户已禁用: {}", user.getUsername());
    }
    
    @Override
    public List<User> getUsersByRole(User.UserRole role) {
        return userRepository.findByRole(role);
    }
    
    @Override
    public List<User> getUsersBySchoolId(Long schoolId) {
        return userRepository.findBySchoolId(schoolId);
    }
    
    @Override
    public List<User> getUsersByClassId(Long classId) {
        return userRepository.findByClassId(classId);
    }
    
    @Override
    public List<User> getTopUsersByAssets(Double minAssets) {
        return userRepository.findTopUsersByAssets(minAssets);
    }
    
    @Override
    @Transactional
    public User updateUserAssets(Long userId, Double amount) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        BigDecimal newAssets = user.getTotalAssets().add(BigDecimal.valueOf(amount));
        user.setTotalAssets(newAssets);
        
        // 更新现金余额
        if (amount > 0) {
            user.setCashBalance(user.getCashBalance().add(BigDecimal.valueOf(amount)));
        }
        
        return userRepository.save(user);
    }
    
    @Override
    @Transactional
    public User updateUserLevel(Long userId, Integer level) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        user.setLevel(level);
        return userRepository.save(user);
    }
    
    @Override
    @Transactional
    public User updateUserCreditScore(Long userId, Integer score) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        user.setCreditScore(score);
        return userRepository.save(user);
    }
    
    @Override
    public Long getActiveUserCount() {
        return (long) userRepository.findActiveUsers().size();
    }
    
    @Override
    public Long getUserCountByRole(User.UserRole role) {
        return userRepository.countByRole(role);
    }
    
    @Override
    public boolean validateToken(String token) {
        return jwtTokenProvider.validateToken(token);
    }
    
    @Override
    public User getUserFromToken(String token) {
        String username = jwtTokenProvider.getUsernameFromToken(token);
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
    }
}