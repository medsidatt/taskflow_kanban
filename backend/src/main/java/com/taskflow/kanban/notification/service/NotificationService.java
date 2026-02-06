package com.taskflow.kanban.notification.service;

import com.taskflow.kanban.notification.NotificationType;
import com.taskflow.kanban.notification.dto.NotificationDto;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.UUID;

public interface NotificationService {

    /**
     * Create a notification and push it via SSE to the user if connected.
     */
    NotificationDto createNotification(UUID userId, NotificationType type, String title, String message, UUID entityId, String entityType);

    /**
     * Get all notifications for a user (limited to most recent 50).
     */
    List<NotificationDto> getNotifications(UUID userId);

    /**
     * Get unread notification count for badge display.
     */
    long getUnreadCount(UUID userId);

    /**
     * Mark a specific notification as read.
     */
    void markAsRead(UUID notificationId);

    /**
     * Mark all notifications as read for a user.
     */
    void markAllAsRead(UUID userId);

    /**
     * Subscribe to SSE stream for real-time notifications.
     */
    SseEmitter subscribe(UUID userId);

    /**
     * Send a notification to a specific user via SSE (if connected).
     */
    void pushNotification(UUID userId, NotificationDto notification);
}
