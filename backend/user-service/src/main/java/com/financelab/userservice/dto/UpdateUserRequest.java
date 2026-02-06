package com.financelab.userservice.dto;

import lombok.Data;

@Data
public class UpdateUserRequest {
    
    private String nickname;
    
    private String avatar;
    
    private Long schoolId;
    
    private Long classId;
    
    private Boolean isActive;
}