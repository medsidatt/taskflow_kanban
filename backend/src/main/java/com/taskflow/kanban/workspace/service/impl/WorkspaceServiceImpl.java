package com.taskflow.kanban.workspace.service.impl;

import com.taskflow.kanban.board.service.ActivityService;
import com.taskflow.kanban.security.CustomUserDetails;
import com.taskflow.kanban.user.entity.User;
import com.taskflow.kanban.user.repository.UserRepository;
import com.taskflow.kanban.workspace.dto.WorkspaceCreateDto;
import com.taskflow.kanban.workspace.dto.WorkspaceDto;
import com.taskflow.kanban.workspace.dto.WorkspaceMemberDto;
import com.taskflow.kanban.workspace.dto.WorkspaceUpdateDto;
import com.taskflow.kanban.workspace.entity.Workspace;
import com.taskflow.kanban.workspace.entity.WorkspaceMember;
import com.taskflow.kanban.workspace.entity.WorkspaceRole;
import com.taskflow.kanban.workspace.repository.WorkspaceMemberRepository;
import com.taskflow.kanban.workspace.repository.WorkspaceRepository;
import com.taskflow.kanban.workspace.service.WorkspaceService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class WorkspaceServiceImpl implements WorkspaceService {

    private final WorkspaceRepository workspaceRepository;
    private final UserRepository userRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final ActivityService activityService;

    @Override
    public WorkspaceDto createWorkspace(WorkspaceCreateDto createDto) {
        User owner = userRepository.findById(getCurrentUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Workspace workspace = Workspace.builder()
                .name(createDto.getName())
                .description(createDto.getDescription())
                .isPrivate(createDto.isPrivate())
                .build();
        
        WorkspaceMember ownerMember = WorkspaceMember.builder()
                .workspace(workspace)
                .user(owner)
                .role(WorkspaceRole.OWNER)
                .build();
        
        workspace.getMembers().add(ownerMember);
        
        Workspace savedWorkspace = workspaceRepository.save(workspace);
        
        activityService.logActivity(savedWorkspace.getId(), "Workspace", "CREATE", 
            "Workspace '" + savedWorkspace.getName() + "' was created",
            getCurrentUserId());
        
        return toDto(savedWorkspace);
    }

    @Override
    @Transactional(readOnly = true)
    public WorkspaceDto getWorkspaceById(UUID id) {
        // Check if user is a member of the workspace
        checkMembership(id);
        return toDto(findWorkspace(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkspaceDto> getAllWorkspacesForCurrentUser() {
        // This is inefficient, but for now it works. Ideally, we'd have a custom query.
        // Or better: workspaceMemberRepository.findByUserId(currentUserId)
        // For simplicity in this refactor, I'll iterate.
        // Actually, let's just fetch all workspaces where the user is a member.
        // Since I don't have that query yet, I'll rely on the fact that we should filter.
        // But wait, workspaceRepository.findAll() returns ALL workspaces.
        // We need to filter by membership.
        
        // Let's assume for now we return all workspaces the user is a member of.
        // I'll need to add a method to WorkspaceRepository or WorkspaceMemberRepository.
        // Let's use a simple stream filter for now as a placeholder, but in prod use a query.
        
        UUID currentUserId = getCurrentUserId();
        return workspaceRepository.findAll().stream()
                .filter(ws -> ws.getMembers().stream().anyMatch(m -> m.getUser().getId().equals(currentUserId)))
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public WorkspaceDto updateWorkspace(UUID id, WorkspaceUpdateDto updateDto) {
        checkPermission(id, WorkspaceRole.ADMIN);
        Workspace workspace = findWorkspace(id);
        if (updateDto.getName() != null) workspace.setName(updateDto.getName());
        if (updateDto.getDescription() != null) workspace.setDescription(updateDto.getDescription());
        if (updateDto.getIsPrivate() != null) workspace.setPrivate(updateDto.getIsPrivate());
        
        Workspace updatedWorkspace = workspaceRepository.save(workspace);
        
        activityService.logActivity(id, "Workspace", "UPDATE", 
            "Workspace '" + updatedWorkspace.getName() + "' was updated",
            getCurrentUserId());
        
        return toDto(updatedWorkspace);
    }

    @Override
    public void deleteWorkspace(UUID id) {
        checkPermission(id, WorkspaceRole.OWNER);
        // Fetch workspace with all related entities to ensure proper cascade deletion
        Workspace workspace = workspaceRepository.findByIdWithAllRelations(id)
                .orElseThrow(() -> new EntityNotFoundException("Workspace not found"));
        String workspaceName = workspace.getName();
        workspaceRepository.delete(workspace);
        
        activityService.logActivity(id, "Workspace", "DELETE", 
            "Workspace '" + workspaceName + "' was deleted",
            getCurrentUserId());
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkspaceMemberDto> getMembers(UUID workspaceId) {
        checkMembership(workspaceId);
        return workspaceMemberRepository.findByWorkspace_Id(workspaceId).stream()
                .map(m -> WorkspaceMemberDto.builder()
                        .id(m.getId())
                        .workspaceId(m.getWorkspace().getId())
                        .userId(m.getUser().getId())
                        .username(m.getUser().getUsername())
                        .email(m.getUser().getEmail())
                        .role(m.getRole())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public void addMember(UUID workspaceId, UUID userId, WorkspaceRole role) {
        checkPermission(workspaceId, WorkspaceRole.ADMIN);
        Workspace workspace = findWorkspace(workspaceId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        
        WorkspaceMember newMember = WorkspaceMember.builder()
                .workspace(workspace)
                .user(user)
                .role(role)
                .build();
        
        workspace.getMembers().add(newMember);
        workspaceRepository.save(workspace);
        
        activityService.logActivity(workspaceId, "Workspace", "MEMBER_ADD", 
            "User '" + user.getUsername() + "' was added to workspace '" + workspace.getName() + "' as " + role,
            getCurrentUserId());
    }

    @Override
    public void removeMember(UUID workspaceId, UUID userId) {
        checkPermission(workspaceId, WorkspaceRole.ADMIN);
        Workspace workspace = findWorkspace(workspaceId);
        User removedUser = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        workspace.getMembers().removeIf(member -> member.getUser().getId().equals(userId));
        workspaceRepository.save(workspace);
        
        activityService.logActivity(workspaceId, "Workspace", "MEMBER_REMOVE", 
            "User '" + removedUser.getUsername() + "' was removed from workspace '" + workspace.getName() + "'",
            getCurrentUserId());
    }

    @Override
    public void updateMemberRole(UUID workspaceId, UUID userId, WorkspaceRole role) {
        checkPermission(workspaceId, WorkspaceRole.ADMIN);
        Workspace workspace = findWorkspace(workspaceId);
        WorkspaceMember member = workspaceMemberRepository.findByWorkspaceIdAndUserId(workspaceId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Workspace member not found"));
        WorkspaceRole oldRole = member.getRole();
        member.setRole(role);
        workspaceMemberRepository.save(member);
        
        activityService.logActivity(workspaceId, "Workspace", "MEMBER_ROLE_UPDATE", 
            "User '" + member.getUser().getUsername() + "' role changed from " + oldRole + " to " + role + " on workspace '" + workspace.getName() + "'",
            getCurrentUserId());
    }

    private Workspace findWorkspace(UUID id) {
        return workspaceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Workspace not found"));
    }

    private WorkspaceDto toDto(Workspace workspace) {
        return WorkspaceDto.builder()
                .id(workspace.getId())
                .name(workspace.getName())
                .description(workspace.getDescription())
                .isPrivate(workspace.isPrivate())
                .build();
    }

    private UUID getCurrentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof CustomUserDetails) {
            return ((CustomUserDetails) principal).getId();
        }
        throw new IllegalStateException("User not authenticated or principal is not CustomUserDetails");
    }

    private void checkMembership(UUID workspaceId) {
        UUID currentUserId = getCurrentUserId();
        workspaceMemberRepository.findByWorkspaceIdAndUserId(workspaceId, currentUserId)
                .orElseThrow(() -> new AccessDeniedException("You are not a member of this workspace"));
    }

    private void checkPermission(UUID workspaceId, WorkspaceRole requiredRole) {
        UUID currentUserId = getCurrentUserId();
        WorkspaceMember member = workspaceMemberRepository.findByWorkspaceIdAndUserId(workspaceId, currentUserId)
                .orElseThrow(() -> new AccessDeniedException("You are not a member of this workspace"));
        
        if (member.getRole().ordinal() > requiredRole.ordinal()) {
            throw new AccessDeniedException("You do not have the required permissions for this action");
        }
    }
}
