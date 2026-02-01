package com.taskflow.kanban.board.service;

import com.taskflow.kanban.board.dto.ActivityLogDto;

import java.util.List;
import java.util.UUID;

public interface ActivityService {
    void logActivity(UUID entityId, String entityType, String action, String details, UUID performedBy);
    List<ActivityLogDto> getActivitiesByEntity(UUID entityId);
    List<ActivityLogDto> getActivitiesByEntityIds(List<UUID> entityIds);
    List<ActivityLogDto> getActivitiesByWorkspace(UUID workspaceId);
    List<ActivityLogDto> getActivitiesByUser(UUID userId);
}
