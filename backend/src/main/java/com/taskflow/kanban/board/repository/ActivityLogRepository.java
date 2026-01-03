package com.taskflow.kanban.board.repository;

import com.taskflow.kanban.board.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, UUID> {
    // Find activities related to a specific entity (e.g., a card or board)
    List<ActivityLog> findByEntityIdOrderByTimestampDesc(UUID entityId);
}
