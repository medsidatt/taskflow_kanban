package com.taskflow.kanban.board.service.impl;

import com.taskflow.kanban.board.dto.ActivityLogDto;
import com.taskflow.kanban.board.entity.ActivityLog;
import com.taskflow.kanban.board.repository.ActivityLogRepository;
import com.taskflow.kanban.board.repository.BoardRepository;
import com.taskflow.kanban.board.repository.CardRepository;
import com.taskflow.kanban.board.repository.ColumnRepository;
import com.taskflow.kanban.board.service.ActivityService;
import com.taskflow.kanban.user.entity.User;
import com.taskflow.kanban.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ActivityServiceImpl implements ActivityService {

    private final ActivityLogRepository activityLogRepository;
    private final UserRepository userRepository;
    private final BoardRepository boardRepository;
    private final ColumnRepository columnRepository;
    private final CardRepository cardRepository;

    @Async
    @Override
    public void logActivity(UUID entityId, String entityType, String action, String details, UUID performedBy) {
        if (performedBy == null) {
            return; // Skip logging when no user context (e.g. system operations)
        }
        ActivityLog log = ActivityLog.builder()
                .entityId(entityId)
                .entityType(entityType)
                .action(action)
                .details(details)
                .performedBy(performedBy)
                .timestamp(Instant.now())
                .build();
        activityLogRepository.save(log);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityLogDto> getActivitiesByEntity(UUID entityId) {
        List<ActivityLog> logs = activityLogRepository.findByEntityIdOrderByTimestampDesc(entityId);
        Map<UUID, String> usernameMap = resolveUsernames(logs);
        return logs.stream()
                .map(log -> toDto(log, usernameMap))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityLogDto> getActivitiesByEntityIds(List<UUID> entityIds) {
        if (entityIds == null || entityIds.isEmpty()) {
            return List.of();
        }
        List<ActivityLog> logs = activityLogRepository.findByEntityIdInOrderByTimestampDesc(entityIds);
        Map<UUID, String> usernameMap = resolveUsernames(logs);
        return logs.stream()
                .map(log -> toDto(log, usernameMap))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityLogDto> getActivitiesByWorkspace(UUID workspaceId) {
        java.util.Set<UUID> entityIds = new java.util.HashSet<>();
        entityIds.add(workspaceId);
        boardRepository.findByWorkspaceId(workspaceId).forEach(b -> {
            entityIds.add(b.getId());
            columnRepository.findByBoardIdOrderByPositionAsc(b.getId()).forEach(c -> {
                entityIds.add(c.getId());
                cardRepository.findByColumnIdOrderByPositionAsc(c.getId()).forEach(card -> entityIds.add(card.getId()));
            });
        });
        return getActivitiesByEntityIds(entityIds.stream().toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityLogDto> getActivitiesByUser(UUID userId) {
        List<ActivityLog> logs = activityLogRepository.findByPerformedByOrderByTimestampDesc(userId);
        Map<UUID, String> usernameMap = resolveUsernames(logs);
        return logs.stream()
                .map(log -> toDto(log, usernameMap))
                .collect(Collectors.toList());
    }

    private Map<UUID, String> resolveUsernames(List<ActivityLog> logs) {
        List<UUID> userIds = logs.stream()
                .map(ActivityLog::getPerformedBy)
                .filter(id -> id != null)
                .distinct()
                .toList();
        if (userIds.isEmpty()) return Map.of();
        return userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(User::getId, User::getUsername, (a, b) -> a));
    }

    private ActivityLogDto toDto(ActivityLog log, Map<UUID, String> usernameMap) {
        String username = log.getPerformedBy() != null
                ? usernameMap.getOrDefault(log.getPerformedBy(), "Unknown")
                : null;
        return ActivityLogDto.builder()
                .id(log.getId())
                .entityId(log.getEntityId())
                .entityType(log.getEntityType())
                .action(log.getAction())
                .details(log.getDetails())
                .timestamp(log.getTimestamp())
                .performedBy(log.getPerformedBy())
                .performedByUsername(username)
                .build();
    }
}
