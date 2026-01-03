package com.taskflow.kanban.board.controller;

import com.taskflow.kanban.board.dto.ActivityLogDto;
import com.taskflow.kanban.board.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
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
    public List<ActivityLogDto> getActivitiesByEntity(@RequestParam UUID entityId) {
        return activityService.getActivitiesByEntity(entityId);
    }
}
