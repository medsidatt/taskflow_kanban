package com.taskflow.kanban.auth.controller;

import com.taskflow.kanban.auth.dto.AuthResponseDto;
import com.taskflow.kanban.auth.dto.LoginDto;
import com.taskflow.kanban.auth.dto.RefreshTokenDto;
import com.taskflow.kanban.auth.dto.RegisterDto;
import com.taskflow.kanban.auth.dto.ResetPasswordDto;
import com.taskflow.kanban.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public AuthResponseDto login(@RequestBody @Valid LoginDto request) {
        return authService.login(request);
    }

    @PostMapping("/refresh")
    public AuthResponseDto refresh(@RequestBody @Valid RefreshTokenDto request) {
        return authService.refreshToken(request);
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponseDto register(@RequestBody @Valid RegisterDto request) {
        return authService.register(request);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout() {
        authService.logout();
    }

    @GetMapping("/verify")
    public String verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);
        return "Email verified successfully";
    }

    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestParam String email) {
        authService.forgotPassword(email);
        return "Password reset email sent";
    }

    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody @Valid ResetPasswordDto request) {
        authService.resetPassword(request);
        return "Password reset successfully";
    }
}
