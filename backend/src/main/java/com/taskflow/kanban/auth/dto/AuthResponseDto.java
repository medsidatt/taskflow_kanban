package com.taskflow.kanban.auth.dto;

import com.taskflow.kanban.user.dto.UserResponseDto;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponseDto {
    private String accessToken;
    private String refreshToken;
    private UserResponseDto user;
}
