package com.taskflow.kanban.user.dto.mappers;

import com.taskflow.kanban.user.dto.*;
import com.taskflow.kanban.user.entity.Role;
import com.taskflow.kanban.user.entity.User;

import java.util.Set;
import java.util.stream.Collectors;

public final class UserMapper {

    private UserMapper() {
        // Utility class
    }

    /* =======================
       ENTITY → RESPONSE DTO
       ======================= */

    public static UserResponseDto toResponseDto(User user) {
        if (user == null) return null;

        return UserResponseDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .active(user.isActive())
                .locked(user.isLocked())
                .emailVerified(user.isEmailVerified())
                .roles(toRoleNames(user.getRoles()))
                .build();
    }

    /* =======================
       ENTITY → SUMMARY DTO
       ======================= */

    public static UserSummaryDto toSummaryDto(User user) {
        if (user == null) return null;

        return UserSummaryDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .active(user.isActive())
                .build();
    }

    /* =======================
       ENTITY → PROFILE DTO
       ======================= */

    public static UserProfileDto toProfileDto(User user) {
        if (user == null) return null;

        return UserProfileDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(toRoleNames(user.getRoles()))
                .lastLogin(user.getLastLogin())
//                .createdAt(user.getCreatedAt())
                .build();
    }

    /* =======================
       CREATE DTO → ENTITY
       ======================= */

    public static User toEntity(UserCreateDto dto) {
        if (dto == null) return null;

        return User.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                // password & roles are set in service (security concern)
                .active(true)
                .accountLocked(false)
                .credentialsExpired(false)
                .accountExpired(false)
                .build();
    }

    /* =======================
       UPDATE DTO → ENTITY (FULL)
       ======================= */

    public static void updateEntity(User user, UserUpdateDto dto) {
        if (dto == null || user == null) return;

        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        // roles handled in service
    }

    /* =======================
       UPDATE DTO → ENTITY (PARTIAL)
       ======================= */

    public static void partialUpdateEntity(User user, UserUpdateDto dto) {
        if (dto == null || user == null) return;

        if (dto.getUsername() != null) {
            user.setUsername(dto.getUsername());
        }

        if (dto.getEmail() != null) {
            user.setEmail(dto.getEmail());
        }
        // roles handled in service
    }

    /* =======================
       HELPERS
       ======================= */

    private static Set<String> toRoleNames(Set<Role> roles) {
        if (roles == null) return Set.of();

        return roles.stream()
                .map(role -> "ROLE_" + role.getName())
                .collect(Collectors.toSet());
    }
}
