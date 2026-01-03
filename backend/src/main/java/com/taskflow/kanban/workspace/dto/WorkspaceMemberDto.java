package com.taskflow.kanban.workspace.dto;

import com.taskflow.kanban.workspace.entity.WorkspaceRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkspaceMemberDto {
    private UUID id;
    private UUID workspaceId;
    private UUID userId;
    private String username;
    private String email;
    private WorkspaceRole role;
}
