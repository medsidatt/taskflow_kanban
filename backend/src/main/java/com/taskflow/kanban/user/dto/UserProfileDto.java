package com.taskflow.kanban.user.dto;

import com.taskflow.kanban.user.entity.Role;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
public class UserProfileDto {

    private UUID id;
    private String username;
    private String email;

    private String firstName;
    private String lastName;
    private String avatarUrl;
    private String bio;
    private Set<String> roles;

    private LocalDateTime lastLogin;
}
