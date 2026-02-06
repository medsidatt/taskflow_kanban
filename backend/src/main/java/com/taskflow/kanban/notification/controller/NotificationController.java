package com.taskflow.kanban.notification.controller;

import com.taskflow.kanban.notification.dto.NotificationDto;
import com.taskflow.kanban.notification.service.NotificationService;
import com.taskflow.kanban.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * Get all notifications for the current user.
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<NotificationDto> getNotifications(@AuthenticationPrincipal CustomUserDetails user) {
        return notificationService.getNotifications(user.getId());
    }

    /**
     * Get unread notification count for badge display.
     */
    @GetMapping("/unread-count")
    @PreAuthorize("isAuthenticated()")
    public Map<String, Long> getUnreadCount(@AuthenticationPrincipal CustomUserDetails user) {
        long count = notificationService.getUnreadCount(user.getId());
        return Map.of("count", count);
    }

    /**
     * Mark a specific notification as read.
     */
    @PutMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> markAsRead(@PathVariable UUID id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Mark all notifications as read for the current user.
     */
    @PutMapping("/read-all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> markAllAsRead(@AuthenticationPrincipal CustomUserDetails user) {
        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.ok().build();
    }

    /**
     * SSE endpoint for real-time notifications.
     * Client connects and receives push notifications in real-time.
     */
    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @PreAuthorize("isAuthenticated()")
    public SseEmitter subscribe(@AuthenticationPrincipal CustomUserDetails user) {
        return notificationService.subscribe(user.getId());
    }
}
