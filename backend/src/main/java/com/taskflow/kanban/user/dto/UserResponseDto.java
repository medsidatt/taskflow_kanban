package com.taskflow.kanban.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {

    private UUID id;
    private String username;
    private String email;

    private boolean active;
    private boolean locked;
    private boolean emailVerified;

    private Set<String> roles;

//    private LocalDateTime createdAt;
//    private LocalDateTime updatedAt;
}
