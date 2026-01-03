package com.taskflow.kanban.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskflow.kanban.security.CustomUserDetails;
import com.taskflow.kanban.security.JwtService;
import com.taskflow.kanban.user.dto.UserCreateDto;
import com.taskflow.kanban.user.entity.Role;
import com.taskflow.kanban.user.entity.User;
import com.taskflow.kanban.user.repository.RoleRepository;
import com.taskflow.kanban.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class UserControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    private String adminToken;
    private String userToken;
    private User adminUser;
    private User normalUser;

    @BeforeEach
    void setUp() {
        // Setup Roles
        Role adminRole = roleRepository.findByName("ADMIN").orElseGet(() -> roleRepository.save(new Role("ADMIN")));
        Role userRole = roleRepository.findByName("USER").orElseGet(() -> roleRepository.save(new Role("USER")));

        // Create Admin User
        adminUser = User.builder()
                .username("admin")
                .email("admin@example.com")
                .password(passwordEncoder.encode("password"))
                .active(true)
                .roles(Set.of(adminRole))
                .build();
        adminUser = userRepository.save(adminUser);
        adminToken = "Bearer " + jwtService.generateToken(new CustomUserDetails(adminUser));

        // Create Normal User
        normalUser = User.builder()
                .username("user")
                .email("user@example.com")
                .password(passwordEncoder.encode("password"))
                .active(true)
                .roles(Set.of(userRole))
                .build();
        normalUser = userRepository.save(normalUser);
        userToken = "Bearer " + jwtService.generateToken(new CustomUserDetails(normalUser));
    }

    @Test
    void createUser_forbiddenForUser() throws Exception {
        UserCreateDto dto = new UserCreateDto();
        dto.setUsername("newuser_fail");
        dto.setEmail("new_fail@example.com");
        dto.setPassword("password");
        dto.setRoles(Set.of("USER"));

        mockMvc.perform(post("/users")
                        .header("Authorization", userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isForbidden());
    }

    @Test
    void createUser_allowedForAdmin() throws Exception {
        UserCreateDto dto = new UserCreateDto();
        dto.setUsername("newuser_success");
        dto.setEmail("new_success@example.com");
        dto.setPassword("password");
        dto.setRoles(Set.of("USER"));

        mockMvc.perform(post("/users")
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());
    }

    @Test
    void getAllUsers_allowedForUser() throws Exception {
        mockMvc.perform(get("/users")
                        .header("Authorization", userToken))
                .andExpect(status().isOk());
    }

    @Test
    void deleteUser_allowedForAdmin() throws Exception {
        // Create a temporary user to delete
        User toDelete = User.builder()
                .username("todelete")
                .email("delete@example.com")
                .password("pass")
                .active(true)
                .roles(Set.of(roleRepository.findByName("USER").get()))
                .build();
        toDelete = userRepository.save(toDelete);

        mockMvc.perform(delete("/users/" + toDelete.getId())
                        .header("Authorization", adminToken))
                .andExpect(status().isOk());
    }

    @Test
    void deleteUser_forbiddenForUser() throws Exception {
        mockMvc.perform(delete("/users/" + adminUser.getId())
                        .header("Authorization", userToken))
                .andExpect(status().isForbidden());
    }
}
