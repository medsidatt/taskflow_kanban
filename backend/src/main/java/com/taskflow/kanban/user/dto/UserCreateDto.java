package com.taskflow.kanban.user.dto;

import lombok.Data;

import java.util.Set;
@Data
public class UserCreateDto {
    private String username;
    private String email;
    private String password;
    private Set<String> roles;
}
