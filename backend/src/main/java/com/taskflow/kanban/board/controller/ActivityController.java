package com.taskflow.kanban.board.controller;

import com.taskflow.kanban.board.dto.ActivityLogDto;
import com.taskflow.kanban.board.service.ActivityService;
import com.taskflow.kanban.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<ActivityLogDto> getActivities(
            @RequestParam(required = false) UUID entityId,
            @RequestParam(required = false) UUID workspaceId,
            @RequestParam(required = false) Boolean me,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        if (Boolean.TRUE.equals(me) && user != null) {
            return activityService.getActivitiesByUser(user.getId());
        }
        if (workspaceId != null) {
            return activityService.getActivitiesByWorkspace(workspaceId);
        }
        if (entityId != null) {
            return activityService.getActivitiesByEntity(entityId);
        }
        return List.of();
    }
}
