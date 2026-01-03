package com.taskflow.kanban.board.service.impl;

import com.taskflow.kanban.board.dto.ActivityLogDto;
import com.taskflow.kanban.board.entity.ActivityLog;
import com.taskflow.kanban.board.repository.ActivityLogRepository;
import com.taskflow.kanban.board.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ActivityServiceImpl implements ActivityService {

    private final ActivityLogRepository activityLogRepository;

    @Async
    @Override
    public void logActivity(UUID entityId, String entityType, String action, String details, UUID performedBy) {
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
        return activityLogRepository.findByEntityIdOrderByTimestampDesc(entityId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private ActivityLogDto toDto(ActivityLog log) {
        return ActivityLogDto.builder()
                .id(log.getId())
                .entityId(log.getEntityId())
                .entityType(log.getEntityType())
                .action(log.getAction())
                .details(log.getDetails())
                .timestamp(log.getTimestamp())
                .performedBy(log.getPerformedBy())
                .build();
    }
}
