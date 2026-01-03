package com.taskflow.kanban.workspace.service;

import com.taskflow.kanban.workspace.dto.WorkspaceCreateDto;
import com.taskflow.kanban.workspace.dto.WorkspaceDto;
import com.taskflow.kanban.workspace.dto.WorkspaceMemberDto;
import com.taskflow.kanban.workspace.dto.WorkspaceUpdateDto;
import com.taskflow.kanban.workspace.entity.WorkspaceRole;

import java.util.List;
import java.util.UUID;

public interface WorkspaceService {
    WorkspaceDto createWorkspace(WorkspaceCreateDto createDto);
    WorkspaceDto getWorkspaceById(UUID id);
    List<WorkspaceDto> getAllWorkspacesForCurrentUser();
    WorkspaceDto updateWorkspace(UUID id, WorkspaceUpdateDto updateDto);
    void deleteWorkspace(UUID id);
    List<WorkspaceMemberDto> getMembers(UUID workspaceId);
    void addMember(UUID workspaceId, UUID userId, WorkspaceRole role);
    void removeMember(UUID workspaceId, UUID userId);
    void updateMemberRole(UUID workspaceId, UUID userId, WorkspaceRole role);
}
