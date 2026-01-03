package com.taskflow.kanban.workspace.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class WorkspaceCreateDto {
    @NotBlank(message = "Name is required")
    private String name;
    private String description;
    
    @JsonProperty("isPrivate")
    private boolean isPrivate;
}
