package com.taskflow.kanban.workspace.dto;

import com.taskflow.kanban.workspace.entity.WorkspaceRole;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class WorkspaceMemberUpdateDto {
    @NotNull(message = "Role is required")
    private WorkspaceRole role;
}
