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
public class CommentDto {
    private UUID id;
    private String content;
    private boolean edited;
    private UUID cardId;
    private UUID authorId;
    private String authorUsername;
    private Instant createdAt;
    private Instant updatedAt;
}
