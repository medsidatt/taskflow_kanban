package com.taskflow.kanban.board.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class ColumnCreateDto {
    @NotBlank(message = "Name is required")
    private String name;
    private Integer wipLimit;
    private Integer position;
    @NotNull(message = "Board ID is required")
    private UUID boardId;
}
