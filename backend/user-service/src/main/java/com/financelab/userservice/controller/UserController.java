package com.financelab.userservice.controller;

import com.financelab.userservice.dto.LoginRequest;
import com.financelab.userservice.dto.RegisterRequest;
import com.financelab.userservice.dto.UpdateUserRequest;
import com.financelab.userservice.entity.User;
import com.financelab.userservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = userService.register(request);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "注册成功");
            response.put("userId", user.getId());
            response.put("username", user.getUsername());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            String token = userService.login(request);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "登录成功");
            response.put("token", token);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/username/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username) {
        return userService.getUserByUsername(username)
                .map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest request) {
        try {
            User updatedUser = userService.updateUser(id, request);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户已禁用");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @GetMapping("/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable User.UserRole role) {
        List<User> users = userService.getUsersByRole(role);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/school/{schoolId}")
    public ResponseEntity<List<User>> getUsersBySchoolId(@PathVariable Long schoolId) {
        List<User> users = userService.getUsersBySchoolId(schoolId);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/class/{classId}")
    public ResponseEntity<List<User>> getUsersByClassId(@PathVariable Long classId) {
        List<User> users = userService.getUsersByClassId(classId);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/top-users")
    public ResponseEntity<List<User>> getTopUsers(@RequestParam(defaultValue = "10000") Double minAssets) {
        List<User> users = userService.getTopUsersByAssets(minAssets);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/stats/active-count")
    public ResponseEntity<Map<String, Long>> getActiveUserCount() {
        Long count = userService.getActiveUserCount();
        Map<String, Long> response = new HashMap<>();
        response.put("activeUserCount", count);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/stats/role-count/{role}")
    public ResponseEntity<Map<String, Long>> getUserCountByRole(@PathVariable User.UserRole role) {
        Long count = userService.getUserCountByRole(role);
        Map<String, Long> response = new HashMap<>();
        response.put("userCount", count);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        boolean isValid = userService.validateToken(token);
        
        Map<String, Object> response = new HashMap<>();
        response.put("valid", isValid);
        
        if (isValid) {
            User user = userService.getUserFromToken(token);
            response.put("user", user);
        }
        
        return ResponseEntity.ok(response);
    }
}