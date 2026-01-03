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
public class LabelDto {
    private UUID id;
    private String name;
    private String color;
    private UUID boardId;
}
