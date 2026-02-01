package com.taskflow.kanban.board.repository;

import com.taskflow.kanban.board.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, UUID> {
    List<ActivityLog> findByEntityIdOrderByTimestampDesc(UUID entityId);
    List<ActivityLog> findByEntityIdInOrderByTimestampDesc(List<UUID> entityIds);
    List<ActivityLog> findByPerformedByOrderByTimestampDesc(UUID performedBy);
}
