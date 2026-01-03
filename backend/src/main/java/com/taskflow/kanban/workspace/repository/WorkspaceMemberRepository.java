package com.taskflow.kanban.workspace.repository;

import com.taskflow.kanban.workspace.entity.WorkspaceMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WorkspaceMemberRepository extends JpaRepository<WorkspaceMember, UUID> {
    Optional<WorkspaceMember> findByWorkspaceIdAndUserId(UUID workspaceId, UUID userId);
    List<WorkspaceMember> findByWorkspace_Id(UUID workspaceId);

    @Query("SELECT wm.workspace.id FROM WorkspaceMember wm WHERE wm.user.id = :userId")
    List<UUID> findWorkspaceIdsByUserId(@Param("userId") UUID userId);
}
