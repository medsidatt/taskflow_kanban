package com.taskflow.kanban.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginDto {
    @NotBlank
    private String login;
    
    @NotBlank
    private String password;
}
