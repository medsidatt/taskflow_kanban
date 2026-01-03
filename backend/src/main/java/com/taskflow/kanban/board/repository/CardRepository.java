package com.taskflow.kanban.board.repository;

import com.taskflow.kanban.board.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface CardRepository extends JpaRepository<Card, UUID> {
    List<Card> findByColumnIdOrderByPositionAsc(UUID columnId);
    List<Card> findByColumnIdAndPositionGreaterThan(UUID columnId, int position);

    List<Card> findByColumn_Board_IdAndArchivedTrue(UUID boardId);

    @Query("SELECT c FROM Card c JOIN c.column col JOIN col.board b WHERE b.workspace.id IN :workspaceIds AND c.archived = false AND (LOWER(c.title) LIKE LOWER(CONCAT('%', :q, '%')) OR (c.description IS NOT NULL AND LOWER(c.description) LIKE LOWER(CONCAT('%', :q, '%'))))")
    List<Card> searchByUserWorkspaces(@Param("q") String q, @Param("workspaceIds") List<UUID> workspaceIds);

    @Query("SELECT COUNT(c) FROM Card c JOIN c.members m WHERE c.column.board.id = :boardId AND m.user.id = :userId")
    long countCardMembersOnBoard(@Param("boardId") UUID boardId, @Param("userId") UUID userId);
}
