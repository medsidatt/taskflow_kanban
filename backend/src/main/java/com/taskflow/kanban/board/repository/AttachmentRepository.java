package com.taskflow.kanban.board.repository;

import com.taskflow.kanban.board.entity.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AttachmentRepository extends JpaRepository<Attachment, UUID> {
    List<Attachment> findByCardId(UUID cardId);
}
