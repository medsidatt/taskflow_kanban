package com.taskflow.kanban.board.repository;

import com.taskflow.kanban.board.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {
    List<Comment> findByCardIdOrderByCreatedAtAsc(UUID cardId);
}
