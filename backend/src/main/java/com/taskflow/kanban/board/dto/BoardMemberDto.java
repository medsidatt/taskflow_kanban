package com.taskflow.kanban.board.dto;

import com.taskflow.kanban.board.entity.BoardRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardMemberDto {
    private UUID id;
    private UUID userId;
    private String username;
    private String email;
    private BoardRole role;
}
