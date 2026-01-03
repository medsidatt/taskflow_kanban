package com.taskflow.kanban.board.dto;

import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class CardUpdateDto {
    private String title;
    private String description;
    private Boolean archived;
    private Boolean achieved;
    private Instant dueDate;
    private Instant startDate;
    private Integer priority;
    /** When true, clears dueDate. */
    private Boolean clearDueDate;
}
