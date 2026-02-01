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

    @Query("SELECT DISTINCT w FROM Workspace w " +
           "LEFT JOIN FETCH w.boards b " +
           "LEFT JOIN FETCH b.columns c " +
           "LEFT JOIN FETCH c.cards card " +
           "LEFT JOIN FETCH card.comments " +
           "LEFT JOIN FETCH card.attachments " +
           "LEFT JOIN FETCH card.members " +
           "LEFT JOIN FETCH b.labels " +
           "LEFT JOIN FETCH b.members " +
           "WHERE w.id = :id")
    java.util.Optional<Workspace> findByIdWithAllRelations(@Param("id") UUID id);
}
