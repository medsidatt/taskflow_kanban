package com.taskflow.kanban.board.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class LabelCreateDto {
    @NotBlank(message = "Name is required")
    private String name;
    private String color;
    @NotNull(message = "Board ID is required")
    private UUID boardId;
}
