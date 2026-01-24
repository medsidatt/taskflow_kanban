package com.taskflow.kanban.workspace.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskflow.kanban.security.CustomUserDetails;
import com.taskflow.kanban.security.JwtService;
import com.taskflow.kanban.user.entity.Role;
import com.taskflow.kanban.user.entity.User;
import com.taskflow.kanban.user.repository.RoleRepository;
import com.taskflow.kanban.user.repository.UserRepository;
import com.taskflow.kanban.workspace.dto.WorkspaceCreateDto;
import com.taskflow.kanban.workspace.dto.WorkspaceUpdateDto;
import com.taskflow.kanban.workspace.entity.Workspace;
import com.taskflow.kanban.workspace.entity.WorkspaceMember;
import com.taskflow.kanban.workspace.entity.WorkspaceRole;
import com.taskflow.kanban.workspace.repository.WorkspaceMemberRepository;
import com.taskflow.kanban.workspace.repository.WorkspaceRepository;
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
class WorkspaceControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private WorkspaceMemberRepository workspaceMemberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    private String userToken;
    private User user;

    @BeforeEach
    void setUp() {
        Role userRole = roleRepository.findByName("USER").orElseGet(() -> roleRepository.save(new Role("USER")));

        user = User.builder()
                .username("workspace_user")
                .email("workspace@example.com")
                .password(passwordEncoder.encode("password"))
                .active(true)
                .roles(Set.of(userRole))
                .build();
        user = userRepository.save(user);
        userToken = "Bearer " + jwtService.generateToken(new CustomUserDetails(user));
    }

    @Test
    void createWorkspace_success() throws Exception {
        WorkspaceCreateDto dto = new WorkspaceCreateDto();
        dto.setName("My Workspace");
        dto.setDescription("Test Description");
        dto.setPrivate(false);

        mockMvc.perform(post("/workspaces")
                        .header("Authorization", userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("My Workspace"));
    }

    @Test
    void getAllWorkspaces_success() throws Exception {
        mockMvc.perform(get("/workspaces")
                        .header("Authorization", userToken))
                .andExpect(status().isOk());
    }

    @Test
    void updateWorkspace_success() throws Exception {
        Workspace workspace = Workspace.builder()
                .name("Old Name")
                .isPrivate(false)
                .build();
        workspace = workspaceRepository.save(workspace);
        workspaceMemberRepository.save(WorkspaceMember.builder()
                .workspace(workspace)
                .user(user)
                .role(WorkspaceRole.OWNER)
                .build());

        WorkspaceUpdateDto updateDto = new WorkspaceUpdateDto();
        updateDto.setName("New Name");

        mockMvc.perform(put("/workspaces/" + workspace.getId())
                        .header("Authorization", userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("New Name"));
    }

    @Test
    void deleteWorkspace_success() throws Exception {
        Workspace workspace = Workspace.builder()
                .name("To Delete")
                .isPrivate(false)
                .build();
        workspace = workspaceRepository.save(workspace);
        workspaceMemberRepository.save(WorkspaceMember.builder()
                .workspace(workspace)
                .user(user)
                .role(WorkspaceRole.OWNER)
                .build());

        mockMvc.perform(delete("/workspaces/" + workspace.getId())
                        .header("Authorization", userToken))
                .andExpect(status().isNoContent());
    }
}
