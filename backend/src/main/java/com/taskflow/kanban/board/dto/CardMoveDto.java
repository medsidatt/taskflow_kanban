package com.taskflow.kanban.board.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CardMoveDto {
    @NotNull(message = "Target Column ID is required")
    private UUID targetColumnId;

    @NotNull(message = "New position is required")
    private Integer newPosition;
}
