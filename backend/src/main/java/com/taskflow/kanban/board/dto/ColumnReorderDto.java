package com.taskflow.kanban.board.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ColumnReorderDto {
    @NotNull(message = "Position is required")
    private Integer position;
}
