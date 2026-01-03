package com.taskflow.kanban.board.dto;

import lombok.Data;

@Data
public class ColumnUpdateDto {
    private String name;
    private Integer wipLimit;
    private Integer position;
    private Boolean archived;
}
