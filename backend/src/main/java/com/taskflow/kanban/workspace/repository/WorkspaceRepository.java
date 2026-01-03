package com.taskflow.kanban.workspace.repository;

import com.taskflow.kanban.workspace.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface WorkspaceRepository extends JpaRepository<Workspace, UUID> {

    @Query("SELECT w FROM Workspace w WHERE w.id IN :workspaceIds AND (LOWER(w.name) LIKE LOWER(CONCAT('%', :q, '%')) OR (w.description IS NOT NULL AND LOWER(w.description) LIKE LOWER(CONCAT('%', :q, '%'))))")
    List<Workspace> searchByUserWorkspaces(@Param("q") String q, @Param("workspaceIds") List<UUID> workspaceIds);
}
