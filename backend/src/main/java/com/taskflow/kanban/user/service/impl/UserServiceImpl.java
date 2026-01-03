package com.taskflow.kanban.user.service.impl;

import com.taskflow.kanban.exception.BadRequestException;
import com.taskflow.kanban.security.CustomUserDetails;
import com.taskflow.kanban.user.dto.ChangePasswordDto;
import com.taskflow.kanban.user.dto.RoleDto;
import com.taskflow.kanban.user.dto.*;
import com.taskflow.kanban.user.dto.mappers.UserMapper;
import com.taskflow.kanban.user.entity.Role;
import com.taskflow.kanban.user.entity.User;
import com.taskflow.kanban.user.repository.RoleRepository;
import com.taskflow.kanban.user.repository.UserRepository;
import com.taskflow.kanban.user.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    /* =======================
       CREATE
       ======================= */

    @Override
    public UserResponseDto createUser(UserCreateDto dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        Set<Role> roles = fetchRoles(dto.getRoles());

        User user = User.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .roles(roles)
                .active(true)
                .build();

        return UserMapper.toResponseDto(userRepository.save(user));
    }

    @Override
    public void bulkCreateUsers(List<UserCreateDto> users) {
        List<User> entities = users.stream().map(dto -> {
            Set<Role> roles = fetchRoles(dto.getRoles());
            return User.builder()
                    .username(dto.getUsername())
                    .email(dto.getEmail())
                    .password(passwordEncoder.encode(dto.getPassword()))
                    .roles(roles)
                    .active(true)
                    .build();
        }).toList();
        userRepository.saveAll(entities);
    }

    /* =======================
       READ
       ======================= */

    @Override
    @Transactional(readOnly = true)
    public List<UserSummaryDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserMapper::toSummaryDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDto getUserById(UUID id) {
        return UserMapper.toResponseDto(findUser(id));
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileDto getCurrentUser() {
        User user = getAuthenticatedUser();
        return UserMapper.toProfileDto(user);
    }

    @Override
    public UserProfileDto updateCurrentUserProfile(UserProfileUpdateDto dto) {
        User user = getAuthenticatedUser();
        if (dto.getUsername() != null && !dto.getUsername().isBlank()) {
            userRepository.findByUsername(dto.getUsername().trim()).ifPresent(other -> {
                if (!other.getId().equals(user.getId())) {
                    throw new IllegalArgumentException("Username already in use");
                }
            });
            user.setUsername(dto.getUsername().trim());
        }
        if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
            userRepository.findByEmail(dto.getEmail().trim()).ifPresent(other -> {
                if (!other.getId().equals(user.getId())) {
                    throw new BadRequestException("Email already in use");
                }
            });
            user.setEmail(dto.getEmail().trim());
        }
        return UserMapper.toProfileDto(userRepository.save(user));
    }

    @Override
    public void changePasswordCurrentUser(ChangePasswordDto dto) {
        User user = getAuthenticatedUser();
        changePassword(user.getId(), dto);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDto getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(UserMapper::toResponseDto)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getUserRoles(UUID id) {
        return findUser(id).getRoles()
                .stream()
                .map(Role::getName)
                .toList();
    }

    @Transactional(readOnly = true)
    @Override
    public List<UserSummaryDto> getActiveUsers() {
        return userRepository.findByActiveTrue()
                .stream()
                .map(UserMapper::toSummaryDto)
                .toList();
    }

    @Transactional(readOnly = true)
    @Override
    public List<UserSummaryDto> getUnlockedUsers() {
        return userRepository.findByAccountLockedFalse()
                .stream()
                .map(UserMapper::toSummaryDto)
                .toList();
    }

    /* =======================
       UPDATE
       ======================= */

    @Override
    public UserResponseDto updateUser(UUID id, UserUpdateDto dto) {
        User user = findUser(id);

        if (dto.getUsername() != null) user.setUsername(dto.getUsername());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getRoles() != null) user.setRoles(fetchRoles(dto.getRoles()));

        return UserMapper.toResponseDto(user);
    }

    @Override
    public UserResponseDto partialUpdateUser(UUID id, UserUpdateDto dto) {
        return updateUser(id, dto); // safe because updateUser handles nulls
    }

    /* =======================
       DELETE
       ======================= */

    @Override
    public void deleteUser(UUID id) {
        userRepository.delete(findUser(id));
    }

    @Override
    public void bulkDeleteUsers(List<UUID> ids) {
        userRepository.deleteAllById(ids);
    }

    /* =======================
       ACCOUNT STATUS
       ======================= */

    @Override
    public void activateUser(UUID id) {
        findUser(id).setActive(true);
    }

    @Override
    public void deactivateUser(UUID id) {
        findUser(id).setActive(false);
    }

    @Override
    public void lockUser(UUID id) {
        findUser(id).setAccountLocked(true);
    }

    @Override
    public void unlockUser(UUID id) {
        findUser(id).setAccountLocked(false);
    }

    @Override
    public void toggleUserActive(UUID id) {
        User user = findUser(id);
        user.setActive(!user.isActive());
    }

    @Override
    public void toggleUserLock(UUID id) {
        User user = findUser(id);
        user.setAccountLocked(!user.isAccountLocked());
    }

    /* =======================
       PASSWORD
       ======================= */

    @Override
    public void changePassword(UUID id, ChangePasswordDto dto) {
        User user = findUser(id);
        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
    }

    @Override
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        // TODO: Implement sending reset password email
    }

    /* =======================
       ROLES
       ======================= */

    @Override
    public void assignRole(UUID id, RoleDto dto) {
        User user = findUser(id);
        Role role = roleRepository.findByName(dto.getName())
                .orElseThrow(() -> new EntityNotFoundException("Role not found"));

        user.getRoles().add(role);
    }

    @Override
    public void removeRole(UUID id, String roleName) {
        User user = findUser(id);
        user.getRoles().removeIf(r -> r.getName().equals(roleName));
    }

    /* =======================
       SEARCH & PAGINATION
       ======================= */

    @Override
    @Transactional(readOnly = true)
    public List<UserSummaryDto> searchUsers(String keyword) {
        // Calls the non-paginated repository method
        return userRepository.search(keyword)
                .stream()
                .map(UserMapper::toSummaryDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserSummaryDto> searchUsers(String keyword, Pageable pageable) {
        // Calls the paginated repository method
        return userRepository.search(keyword, pageable)
                .map(UserMapper::toSummaryDto);
    }


    @Override
    @Transactional(readOnly = true)
    public Page<UserSummaryDto> getUsersPage(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(UserMapper::toSummaryDto);
    }

    /* =======================
       EXISTENCE CHECKS
       ======================= */

    @Transactional(readOnly = true)
    @Override
    public boolean usernameExists(String username) {
        return userRepository.existsByUsername(username);
    }

    @Transactional(readOnly = true)
    @Override
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    /* =======================
       HELPERS
       ======================= */

    private User findUser(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    private Set<Role> fetchRoles(Set<String> roleNames) {
        return roleNames.stream()
                .map(name -> roleRepository.findByName(name)
                        .orElseThrow(() -> new EntityNotFoundException("Role not found: " + name)))
                .collect(Collectors.toSet());
    }

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            return userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));
        }
        throw new IllegalStateException("User not authenticated");
    }
}
