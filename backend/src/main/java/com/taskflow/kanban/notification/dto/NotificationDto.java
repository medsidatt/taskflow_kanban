package com.taskflow.kanban.notification.dto;

import com.taskflow.kanban.notification.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    private UUID id;
    private NotificationType type;
    private String title;
    private String message;
    private UUID entityId;
    private String entityType;
    private boolean isRead;
    private Instant createdAt;
}
