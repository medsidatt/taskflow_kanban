package com.taskflow.kanban.user.service;

import com.taskflow.kanban.user.dto.UserCreateDto;
import com.taskflow.kanban.user.dto.UserResponseDto;
import com.taskflow.kanban.user.dto.UserUpdateDto;
import com.taskflow.kanban.user.entity.Role;
import com.taskflow.kanban.user.entity.User;
import com.taskflow.kanban.user.repository.RoleRepository;
import com.taskflow.kanban.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @BeforeEach
    void setUp() {
        if (roleRepository.findByName("USER").isEmpty()) {
            roleRepository.save(new Role("USER"));
        }
    }

    @Test
    void createUser_success() {
        UserCreateDto createDto = new UserCreateDto();
        createDto.setUsername("newuser");
        createDto.setEmail("new@example.com");
        createDto.setPassword("password");
        createDto.setRoles(Set.of("USER"));

        UserResponseDto response = userService.createUser(createDto);

        assertNotNull(response);
        assertNotNull(response.getId());
        assertEquals("newuser", response.getUsername());
        assertTrue(userRepository.existsByEmail("new@example.com"));
    }

    @Test
    void getUserById_success() {
        // Create a user directly in DB
        User user = User.builder()
                .username("existing")
                .email("existing@example.com")
                .password("pass")
                .active(true)
                .roles(Set.of(roleRepository.findByName("USER").get()))
                .build();
        user = userRepository.save(user);

        UserResponseDto response = userService.getUserById(user.getId());

        assertNotNull(response);
        assertEquals("existing", response.getUsername());
    }

    @Test
    void updateUser_success() {
        User user = User.builder()
                .username("toupdate")
                .email("toupdate@example.com")
                .password("pass")
                .active(true)
                .roles(Set.of(roleRepository.findByName("USER").get()))
                .build();
        user = userRepository.save(user);

        UserUpdateDto updateDto = new UserUpdateDto();
        updateDto.setUsername("updatedUser");
        updateDto.setEmail("updated@example.com");

        UserResponseDto response = userService.updateUser(user.getId(), updateDto);

        assertEquals("updatedUser", response.getUsername());
        assertEquals("updated@example.com", response.getEmail());
        
        User updatedUser = userRepository.findById(user.getId()).orElseThrow();
        assertEquals("updatedUser", updatedUser.getUsername());
    }

    @Test
    void deleteUser_success() {
        User user = User.builder()
                .username("todelete")
                .email("todelete@example.com")
                .password("pass")
                .active(true)
                .roles(Set.of(roleRepository.findByName("USER").get()))
                .build();
        user = userRepository.save(user);

        userService.deleteUser(user.getId());

        assertFalse(userRepository.existsById(user.getId()));
    }

    @Test
    void deactivateUser_success() {
        User user = User.builder()
                .username("todeactivate")
                .email("todeactivate@example.com")
                .password("pass")
                .active(true)
                .roles(Set.of(roleRepository.findByName("USER").get()))
                .build();
        user = userRepository.save(user);

        userService.deactivateUser(user.getId());

        User updatedUser = userRepository.findById(user.getId()).orElseThrow();
        assertFalse(updatedUser.isActive());
    }

    @Test
    void lockUser_success() {
        User user = User.builder()
                .username("tolock")
                .email("tolock@example.com")
                .password("pass")
                .active(true)
                .accountLocked(false)
                .roles(Set.of(roleRepository.findByName("USER").get()))
                .build();
        user = userRepository.save(user);

        userService.lockUser(user.getId());

        User updatedUser = userRepository.findById(user.getId()).orElseThrow();
        assertTrue(updatedUser.isAccountLocked());
    }
}
