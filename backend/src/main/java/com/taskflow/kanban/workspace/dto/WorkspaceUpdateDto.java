package com.taskflow.kanban.workspace.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class WorkspaceUpdateDto {
    private String name;
    private String description;
    
    @JsonProperty("isPrivate")
    private Boolean isPrivate;
}
