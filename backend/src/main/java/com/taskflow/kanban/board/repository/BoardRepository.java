package com.taskflow.kanban.board.repository;

import com.taskflow.kanban.board.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface BoardRepository extends JpaRepository<Board, UUID> {
    List<Board> findByWorkspaceId(UUID workspaceId);
    List<Board> findByWorkspace_IdIn(List<UUID> workspaceIds);

    @Query("SELECT b FROM Board b WHERE b.workspace.id IN :workspaceIds AND b.archived = false AND (LOWER(b.name) LIKE LOWER(CONCAT('%', :q, '%')) OR (b.description IS NOT NULL AND LOWER(b.description) LIKE LOWER(CONCAT('%', :q, '%'))))")
    List<Board> searchByUserWorkspaces(@Param("q") String q, @Param("workspaceIds") List<UUID> workspaceIds);

    @Query("SELECT DISTINCT b FROM Board b JOIN b.members m WHERE m.user.id = :userId")
    List<Board> findByBoardMemberUserId(@Param("userId") UUID userId);

    @Query("SELECT DISTINCT c.column.board FROM Card c JOIN c.members m WHERE m.user.id = :userId")
    List<Board> findBoardsByCardMemberUserId(@Param("userId") UUID userId);
}
