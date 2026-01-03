package com.taskflow.kanban.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskflow.kanban.security.CustomUserDetails;
import com.taskflow.kanban.security.JwtService;
import com.taskflow.kanban.user.dto.RoleDto;
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
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class RoleControllerSecurityTest {

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

    @BeforeEach
    void setUp() {
        // Setup Roles
        Role adminRole = roleRepository.findByName("ADMIN").orElseGet(() -> roleRepository.save(new Role("ADMIN")));
        Role userRole = roleRepository.findByName("USER").orElseGet(() -> roleRepository.save(new Role("USER")));

        // Create Admin User
        User adminUser = User.builder()
                .username("admin_role_test")
                .email("admin_role@example.com")
                .password(passwordEncoder.encode("password"))
                .active(true)
                .roles(Set.of(adminRole))
                .build();
        adminUser = userRepository.save(adminUser);
        adminToken = "Bearer " + jwtService.generateToken(new CustomUserDetails(adminUser));

        // Create Normal User
        User normalUser = User.builder()
                .username("user_role_test")
                .email("user_role@example.com")
                .password(passwordEncoder.encode("password"))
                .active(true)
                .roles(Set.of(userRole))
                .build();
        normalUser = userRepository.save(normalUser);
        userToken = "Bearer " + jwtService.generateToken(new CustomUserDetails(normalUser));
    }

    @Test
    void createRole_allowedForAdmin() throws Exception {
        RoleDto roleDto = new RoleDto();
        roleDto.setName("NEW_ROLE");

        mockMvc.perform(post("/roles")
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(roleDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("NEW_ROLE"));
    }

    @Test
    void createRole_forbiddenForUser() throws Exception {
        RoleDto roleDto = new RoleDto();
        roleDto.setName("NEW_ROLE_FAIL");

        mockMvc.perform(post("/roles")
                        .header("Authorization", userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(roleDto)))
                .andExpect(status().isForbidden());
    }

    @Test
    void getAllRoles_allowedForAdmin() throws Exception {
        mockMvc.perform(get("/roles")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void getAllRoles_forbiddenForUser() throws Exception {
        mockMvc.perform(get("/roles")
                        .header("Authorization", userToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void updateRole_allowedForAdmin() throws Exception {
        Role role = roleRepository.save(new Role("TO_UPDATE"));
        RoleDto updateDto = new RoleDto();
        updateDto.setName("UPDATED_ROLE");

        mockMvc.perform(put("/roles/" + role.getId())
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("UPDATED_ROLE"));
    }

    @Test
    void deleteRole_allowedForAdmin() throws Exception {
        Role role = roleRepository.save(new Role("TO_DELETE"));

        mockMvc.perform(delete("/roles/" + role.getId())
                        .header("Authorization", adminToken))
                .andExpect(status().isNoContent());
    }
}
