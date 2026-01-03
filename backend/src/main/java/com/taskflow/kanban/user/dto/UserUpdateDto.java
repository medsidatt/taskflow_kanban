package com.taskflow.kanban.user.dto;

import lombok.Data;

import java.util.Set;
@Data
public class UserUpdateDto {
    private String email;
    private String username;
    private boolean active;
    private boolean accountLocked;
    private Set<String> roles;
    private Long employeeId;
}

