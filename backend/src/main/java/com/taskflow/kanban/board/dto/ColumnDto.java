package com.taskflow.kanban.board.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ColumnDto {
    private UUID id;
    private String name;
    private int position;
    private Integer wipLimit;
    private boolean archived;
    private UUID boardId;
}
