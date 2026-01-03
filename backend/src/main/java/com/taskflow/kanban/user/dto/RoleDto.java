package com.taskflow.kanban.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleDto {

    private UUID id;

    @NotBlank(message = "Role name is required")
    private String name;
}
