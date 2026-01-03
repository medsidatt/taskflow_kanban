package com.taskflow.kanban.board.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class BoardCreateDto {

    @NotBlank(message = "Name is required")
    private String name;
    private String description;
    
    @JsonProperty("isPrivate")
    private boolean isPrivate;
    
    private String backgroundColor;

    @NotNull(message = "Workspace ID is required")
    private UUID workspaceId;
}
