package com.taskflow.kanban.auth.service;

import com.taskflow.kanban.auth.dto.AuthResponseDto;
import com.taskflow.kanban.auth.dto.LoginDto;
import com.taskflow.kanban.auth.dto.RefreshTokenDto;
import com.taskflow.kanban.auth.dto.RegisterDto;
import com.taskflow.kanban.auth.dto.ResetPasswordDto;

public interface AuthService {

    AuthResponseDto register(RegisterDto request);

    AuthResponseDto login(LoginDto request);

    AuthResponseDto refreshToken(RefreshTokenDto request);

    void logout();

    void verifyEmail(String token);

    void forgotPassword(String email);

    void resetPassword(ResetPasswordDto request);
}
