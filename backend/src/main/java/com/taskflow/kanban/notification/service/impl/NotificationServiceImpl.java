package com.taskflow.kanban.notification.service.impl;

import com.taskflow.kanban.notification.NotificationType;
import com.taskflow.kanban.notification.dto.NotificationDto;
import com.taskflow.kanban.notification.entity.Notification;
import com.taskflow.kanban.notification.repository.NotificationRepository;
import com.taskflow.kanban.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    // Map of userId to their SSE emitter for real-time push
    private final Map<UUID, SseEmitter> emitters = new ConcurrentHashMap<>();

    @Override
    public NotificationDto createNotification(UUID userId, NotificationType type, String title, String message, UUID entityId, String entityType) {
        Notification notification = Notification.builder()
                .userId(userId)
                .type(type)
                .title(title)
                .message(message)
                .entityId(entityId)
                .entityType(entityType)
                .isRead(false)
                .createdAt(Instant.now())
                .build();

        notification = notificationRepository.save(notification);
        NotificationDto dto = toDto(notification);

        // Push via SSE asynchronously
        pushNotification(userId, dto);

        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationDto> getNotifications(UUID userId) {
        return notificationRepository.findTop50ByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(UUID userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Override
    public void markAsRead(UUID notificationId) {
        notificationRepository.markAsRead(notificationId);
    }

    @Override
    public void markAllAsRead(UUID userId) {
        notificationRepository.markAllAsReadByUserId(userId);
    }

    @Override
    public SseEmitter subscribe(UUID userId) {
        // Timeout after 30 minutes (connection will be re-established by client)
        SseEmitter emitter = new SseEmitter(30 * 60 * 1000L);

        // Remove old emitter if exists
        SseEmitter oldEmitter = emitters.put(userId, emitter);
        if (oldEmitter != null) {
            oldEmitter.complete();
        }

        emitter.onCompletion(() -> {
            log.debug("SSE connection completed for user {}", userId);
            emitters.remove(userId, emitter);
        });

        emitter.onTimeout(() -> {
            log.debug("SSE connection timed out for user {}", userId);
            emitters.remove(userId, emitter);
        });

        emitter.onError(e -> {
            log.debug("SSE connection error for user {}: {}", userId, e.getMessage());
            emitters.remove(userId, emitter);
        });

        // Send initial connection event
        try {
            emitter.send(SseEmitter.event()
                    .name("connected")
                    .data("Connected to notification stream"));
        } catch (IOException e) {
            log.warn("Failed to send initial SSE event to user {}", userId);
            emitters.remove(userId, emitter);
        }

        return emitter;
    }

    @Override
    @Async
    public void pushNotification(UUID userId, NotificationDto notification) {
        SseEmitter emitter = emitters.get(userId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name("notification")
                        .data(notification));
                log.debug("Pushed notification to user {}", userId);
            } catch (IOException e) {
                log.debug("Failed to push notification to user {}, removing emitter", userId);
                emitters.remove(userId, emitter);
            }
        }
    }

    private NotificationDto toDto(Notification notification) {
        return NotificationDto.builder()
                .id(notification.getId())
                .type(notification.getType())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .entityId(notification.getEntityId())
                .entityType(notification.getEntityType())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
