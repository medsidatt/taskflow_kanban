package com.taskflow.kanban.user.controller;

import com.taskflow.kanban.user.dto.ChangePasswordDto;
import com.taskflow.kanban.user.dto.RoleDto;
import com.taskflow.kanban.user.dto.UserProfileUpdateDto;
import com.taskflow.kanban.user.dto.*;
import com.taskflow.kanban.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /* =======================
       CREATE
       ======================= */

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponseDto createUser(
            @RequestBody @Valid UserCreateDto dto
    ) {
        return userService.createUser(dto);
    }

    /* =======================
       READ
       ======================= */

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public List<UserSummaryDto> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public UserResponseDto getUserById(@PathVariable UUID id) {
        return userService.getUserById(id);
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public UserProfileDto getCurrentUser() {
        return userService.getCurrentUser();
    }

    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public UserProfileDto updateCurrentUserProfile(@RequestBody @Valid UserProfileUpdateDto dto) {
        return userService.updateCurrentUserProfile(dto);
    }

    @PutMapping("/me/change-password")
    @PreAuthorize("isAuthenticated()")
    public void changePasswordCurrentUser(@RequestBody @Valid ChangePasswordDto dto) {
        userService.changePasswordCurrentUser(dto);
    }

    @GetMapping("/by-email")
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponseDto getUserByEmail(@RequestParam String email) {
        return userService.getUserByEmail(email);
    }

    /* =======================
       UPDATE
       ======================= */

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCurrentUser(#id)")
    public UserResponseDto updateUser(
            @PathVariable UUID id,
            @RequestBody @Valid UserUpdateDto dto
    ) {
        return userService.updateUser(id, dto);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCurrentUser(#id)")
    public UserResponseDto partialUpdateUser(
            @PathVariable UUID id,
            @RequestBody UserUpdateDto dto
    ) {
        return userService.partialUpdateUser(id, dto);
    }

    /* =======================
       DELETE
       ======================= */

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
    }

    /* =======================
       ACCOUNT STATUS
       ======================= */

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public void activateUser(@PathVariable UUID id) {
        userService.activateUser(id);
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public void deactivateUser(@PathVariable UUID id) {
        userService.deactivateUser(id);
    }

    @PutMapping("/{id}/lock")
    @PreAuthorize("hasRole('ADMIN')")
    public void lockUser(@PathVariable UUID id) {
        userService.lockUser(id);
    }

    @PutMapping("/{id}/unlock")
    @PreAuthorize("hasRole('ADMIN')")
    public void unlockUser(@PathVariable UUID id) {
        userService.unlockUser(id);
    }

    /* =======================
       PASSWORD
       ======================= */

    @PutMapping("/{id}/change-password")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCurrentUser(#id)")
    public void changePassword(
            @PathVariable UUID id,
            @RequestBody @Valid ChangePasswordDto dto
    ) {
        userService.changePassword(id, dto);
    }

    @PostMapping("/forgot-password")
    public void forgotPassword(@RequestParam String email) {
        userService.forgotPassword(email);
    }

    /* =======================
       ROLES & PERMISSIONS
       ======================= */

    @PutMapping("/{id}/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public void assignRole(
            @PathVariable UUID id,
            @RequestBody RoleDto dto
    ) {
        userService.assignRole(id, dto);
    }

    @DeleteMapping("/{id}/roles/{roleName}")
    @PreAuthorize("hasRole('ADMIN')")
    public void removeRole(
            @PathVariable UUID id,
            @PathVariable String roleName
    ) {
        userService.removeRole(id, roleName);
    }

    @GetMapping("/{id}/roles")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public List<String> getUserRoles(@PathVariable UUID id) {
        return userService.getUserRoles(id);
    }

    /* =======================
       SEARCH & PAGINATION
       ======================= */

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public List<UserSummaryDto> searchUsers(
            @RequestParam String keyword
    ) {
        return userService.searchUsers(keyword);
    }

    @GetMapping("/page")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public Page<UserSummaryDto> getUsersPage(Pageable pageable) {
        return userService.getUsersPage(pageable);
    }

    /* =======================
       ADMIN
       ======================= */

    @PostMapping("/bulk")
    @PreAuthorize("hasRole('ADMIN')")
    public void bulkCreateUsers(
            @RequestBody @Valid List<UserCreateDto> users
    ) {
        userService.bulkCreateUsers(users);
    }

    @DeleteMapping("/bulk")
    @PreAuthorize("hasRole('ADMIN')")
    public void bulkDeleteUsers(
            @RequestBody List<UUID> ids
    ) {
        userService.bulkDeleteUsers(ids);
    }
}
