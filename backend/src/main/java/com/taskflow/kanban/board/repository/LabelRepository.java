package com.taskflow.kanban.board.repository;

import com.taskflow.kanban.board.entity.Label;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LabelRepository extends JpaRepository<Label, UUID> {
    List<Label> findByBoardId(UUID boardId);
}
