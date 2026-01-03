package com.taskflow.kanban.user.service;

import com.taskflow.kanban.user.dto.ChangePasswordDto;
import com.taskflow.kanban.user.dto.RoleDto;
import com.taskflow.kanban.user.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

public interface UserService {

    /* =======================
       CREATE
       ======================= */
    UserResponseDto createUser(UserCreateDto dto);

    void bulkCreateUsers(List<UserCreateDto> users);

    /* =======================
       READ
       ======================= */
    List<UserSummaryDto> getAllUsers();

    UserResponseDto getUserById(UUID id);

    UserProfileDto getCurrentUser();

    UserProfileDto updateCurrentUserProfile(UserProfileUpdateDto dto);

    void changePasswordCurrentUser(ChangePasswordDto dto);

    UserResponseDto getUserByEmail(String email);

    List<String> getUserRoles(UUID id);

    @Transactional(readOnly = true)
    List<UserSummaryDto> getActiveUsers();

    @Transactional(readOnly = true)
    List<UserSummaryDto> getUnlockedUsers();

    /* =======================
               UPDATE
               ======================= */
    UserResponseDto updateUser(UUID id, UserUpdateDto dto);

    UserResponseDto partialUpdateUser(UUID id, UserUpdateDto dto);

    /* =======================
       DELETE
       ======================= */
    void deleteUser(UUID id);

    void bulkDeleteUsers(List<UUID> ids);

    /* =======================
       ACCOUNT STATUS
       ======================= */
    void activateUser(UUID id);

    void deactivateUser(UUID id);

    void lockUser(UUID id);

    void unlockUser(UUID id);

    void toggleUserActive(UUID id);

    void toggleUserLock(UUID id);

    /* =======================
           PASSWORD
           ======================= */
    void changePassword(UUID id, ChangePasswordDto dto);

    void forgotPassword(String email);

    /* =======================
       ROLES
       ======================= */
    void assignRole(UUID id, RoleDto dto);

    void removeRole(UUID id, String roleName);

    /* =======================
       SEARCH & PAGINATION
       ======================= */
    List<UserSummaryDto> searchUsers(String keyword);

    @Transactional(readOnly = true)
    Page<UserSummaryDto> searchUsers(String keyword, Pageable pageable);

    Page<UserSummaryDto> getUsersPage(Pageable pageable);

    @Transactional(readOnly = true)
    boolean usernameExists(String username);

    @Transactional(readOnly = true)
    boolean emailExists(String email);
}
