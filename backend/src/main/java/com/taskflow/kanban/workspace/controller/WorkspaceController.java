package com.taskflow.kanban.workspace.controller;

import com.taskflow.kanban.workspace.dto.WorkspaceCreateDto;
import com.taskflow.kanban.workspace.dto.WorkspaceDto;
import com.taskflow.kanban.workspace.dto.WorkspaceMemberDto;
import com.taskflow.kanban.workspace.dto.WorkspaceMemberUpdateDto;
import com.taskflow.kanban.workspace.dto.WorkspaceUpdateDto;
import com.taskflow.kanban.workspace.entity.WorkspaceRole;
import com.taskflow.kanban.workspace.service.WorkspaceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/workspaces")
@RequiredArgsConstructor
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("isAuthenticated()")
    public WorkspaceDto createWorkspace(@RequestBody @Valid WorkspaceCreateDto createDto) {
        return workspaceService.createWorkspace(createDto);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<WorkspaceDto> getAllWorkspaces() {
        return workspaceService.getAllWorkspacesForCurrentUser();
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public WorkspaceDto getWorkspaceById(@PathVariable UUID id) {
        return workspaceService.getWorkspaceById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public WorkspaceDto updateWorkspace(@PathVariable UUID id, @RequestBody WorkspaceUpdateDto updateDto) {
        return workspaceService.updateWorkspace(id, updateDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("isAuthenticated()")
    public void deleteWorkspace(@PathVariable UUID id) {
        workspaceService.deleteWorkspace(id);
    }

    @GetMapping("/{id}/members")
    @PreAuthorize("isAuthenticated()")
    public List<WorkspaceMemberDto> getMembers(@PathVariable UUID id) {
        return workspaceService.getMembers(id);
    }

    @PostMapping("/{id}/members/{userId}")
    @PreAuthorize("isAuthenticated()")
    public void addMember(@PathVariable UUID id, @PathVariable UUID userId) {
        // Default to MEMBER role
        workspaceService.addMember(id, userId, WorkspaceRole.MEMBER);
    }

    @DeleteMapping("/{id}/members/{userId}")
    @PreAuthorize("isAuthenticated()")
    public void removeMember(@PathVariable UUID id, @PathVariable UUID userId) {
        workspaceService.removeMember(id, userId);
    }

    @PutMapping("/{id}/members/{userId}")
    @PreAuthorize("isAuthenticated()")
    public void updateMemberRole(@PathVariable UUID id, @PathVariable UUID userId, @RequestBody @Valid WorkspaceMemberUpdateDto updateDto) {
        workspaceService.updateMemberRole(id, userId, updateDto.getRole());
    }
}
