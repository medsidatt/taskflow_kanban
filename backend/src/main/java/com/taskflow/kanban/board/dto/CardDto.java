package com.taskflow.kanban.board.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CardDto {
    private UUID id;
    private String title;
    private String description;
    private int position;
    private boolean archived;
    private boolean achieved;
    private Instant dueDate;
    private Instant startDate;
    private Integer priority;
    private UUID columnId;
    private Set<CardMemberDto> members;
    private Set<LabelDto> labels;
}
