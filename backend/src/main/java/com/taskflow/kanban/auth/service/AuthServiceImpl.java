package com.taskflow.kanban.auth.service;

import com.taskflow.kanban.auth.dto.AuthResponseDto;
import com.taskflow.kanban.auth.dto.LoginDto;
import com.taskflow.kanban.auth.dto.RefreshTokenDto;
import com.taskflow.kanban.auth.dto.RegisterDto;
import com.taskflow.kanban.auth.dto.ResetPasswordDto;
import com.taskflow.kanban.exception.BadRequestException;
import com.taskflow.kanban.exception.ForbiddenException;
import com.taskflow.kanban.exception.ResourceNotFoundException;
import com.taskflow.kanban.exception.UnauthorizedException;
import com.taskflow.kanban.security.CustomUserDetails;
import com.taskflow.kanban.security.JwtAuthenticationFilter;
import com.taskflow.kanban.user.entity.Role;
import com.taskflow.kanban.user.entity.User;
import com.taskflow.kanban.user.repository.RoleRepository;
import com.taskflow.kanban.user.repository.UserRepository;
import com.taskflow.kanban.security.JwtService;
import com.taskflow.kanban.user.dto.mappers.UserMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);


    @Override
    public AuthResponseDto register(RegisterDto request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already in use");
        }

        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new IllegalStateException("Default role not found"));

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .active(true)
                .roles(new HashSet<>(Set.of(userRole)))
                .accountLocked(false)
                .build();

        userRepository.save(user);

        return generateAuthResponse(user);
    }

    @Override
    @Transactional
    public AuthResponseDto login(LoginDto request) {
        String login = request.getLogin();
        User user;

        if (login.contains("@")) { // treat as email
            user = userRepository.findByEmailWithRoles(login)
                    .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));
        } else { // treat as username
            user = userRepository.findByUsernameWithRoles(login)
                    .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        if (!user.isActive() || user.isLocked()) {
            throw new ForbiddenException("Account disabled or locked");
        }

        // --- Update last login info ---
        user.setLastLogin(LocalDateTime.now());
        try {
            HttpServletRequest servletRequest = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
            user.setLastLoginIp(servletRequest.getRemoteAddr());
        } catch (IllegalStateException e) {
            // This might happen in a non-request context (e.g., tests)
            user.setLastLoginIp("unknown");
        }
        userRepository.save(user);
        // ---

        return generateAuthResponse(user);
    }


    @Override
    public AuthResponseDto refreshToken(RefreshTokenDto request) {
        String subject = jwtService.extractUsername(request.getRefreshToken());
        User user = userRepository.findByIdWithRoles(UUID.fromString(subject))
                .orElseThrow(() -> new UnauthorizedException("Invalid token"));

        CustomUserDetails userDetails = new CustomUserDetails(user);
        if (!jwtService.isTokenValid(request.getRefreshToken(), userDetails)) {
            throw new UnauthorizedException("Invalid token");
        }

        return generateAuthResponse(user);
    }

    @Override
    public void logout() {

    }

    @Override
    public void verifyEmail(String token) {
        // TODO: implement email verification using token
    }

    @Override
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Email not found"));
        // TODO: send reset password email with token
    }

    @Override
    public void resetPassword(ResetPasswordDto request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Email not found"));
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private AuthResponseDto generateAuthResponse(User user) {
        CustomUserDetails userDetails = new CustomUserDetails(user);
        return AuthResponseDto.builder()
                .accessToken(jwtService.generateToken(userDetails))
                .refreshToken(jwtService.generateRefreshToken(userDetails))
                .user(UserMapper.toResponseDto(user))
                .build();
    }
}
