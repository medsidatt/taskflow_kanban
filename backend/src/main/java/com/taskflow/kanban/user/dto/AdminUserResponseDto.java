package com.taskflow.kanban.user.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class AdminUserResponseDto {

    private UUID id;
    private String username;
    private String email;

    private boolean active;
    private boolean locked;

    private int failedLoginAttempts;

    private LocalDateTime lastLogin;
    private LocalDateTime createdAt;
}
