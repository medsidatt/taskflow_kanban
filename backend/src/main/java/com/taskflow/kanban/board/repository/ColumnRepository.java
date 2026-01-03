package com.taskflow.kanban.board.repository;

import com.taskflow.kanban.board.entity.BoardColumn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ColumnRepository extends JpaRepository<BoardColumn, UUID> {
    List<BoardColumn> findByBoardIdOrderByPositionAsc(UUID boardId);

    @Query("SELECT c FROM BoardColumn c JOIN c.board b WHERE b.workspace.id IN :workspaceIds AND c.archived = false AND LOWER(c.name) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<BoardColumn> searchByUserWorkspaces(@Param("q") String q, @Param("workspaceIds") List<UUID> workspaceIds);
}
