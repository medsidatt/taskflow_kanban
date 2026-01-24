package com.taskflow.kanban.auth.service;

import com.taskflow.kanban.auth.dto.AuthResponseDto;
import com.taskflow.kanban.auth.dto.LoginDto;
import com.taskflow.kanban.auth.dto.RegisterDto;
import com.taskflow.kanban.user.entity.Role;
import com.taskflow.kanban.user.repository.RoleRepository;
import com.taskflow.kanban.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    private RegisterDto registerDto;
    private LoginDto loginDto;

    @BeforeEach
    void setUp() {
        // Ensure roles exist
        if (roleRepository.findByName("USER").isEmpty()) {
            roleRepository.save(new Role("USER"));
        }
        if (roleRepository.findByName("ADMIN").isEmpty()) {
            roleRepository.save(new Role("ADMIN"));
        }

        registerDto = new RegisterDto();
        registerDto.setUsername("testuser");
        registerDto.setEmail("test@example.com");
        registerDto.setPassword("password123");

        loginDto = new LoginDto();
        loginDto.setLogin("test@example.com");
        loginDto.setPassword("password123");
    }

    @Test
    void register_success() {
        AuthResponseDto response = authService.register(registerDto);

        assertNotNull(response);
        assertNotNull(response.getAccessToken());
        assertNotNull(response.getRefreshToken());
        assertEquals("testuser", response.getUser().getUsername());
        
        assertTrue(userRepository.existsByEmail("test@example.com"));
    }

    @Test
    void login_success() {
        // Register first
        authService.register(registerDto);

        // Then login
        AuthResponseDto response = authService.login(loginDto);

        assertNotNull(response);
        assertNotNull(response.getAccessToken());
        assertEquals("testuser", response.getUser().getUsername());
    }

    @Test
    void login_invalidCredentials() {
        authService.register(registerDto);

        LoginDto invalidLogin = new LoginDto();
        invalidLogin.setLogin("test@example.com");
        invalidLogin.setPassword("wrongpassword");

        assertThrows(com.taskflow.kanban.exception.UnauthorizedException.class, () -> authService.login(invalidLogin));
    }
}
