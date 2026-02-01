package com.taskflow.kanban.board.dto;

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
public class ActivityLogDto {
    private UUID id;
    private UUID entityId;
    private String entityType;
    private String action;
    private String details;
    private Instant timestamp;
    private UUID performedBy;
    private String performedByUsername;
}
