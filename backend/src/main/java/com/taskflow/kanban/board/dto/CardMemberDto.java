package com.taskflow.kanban.board.dto;

import com.taskflow.kanban.board.entity.CardRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CardMemberDto {
    private UUID userId;
    private String username;
    private String email;
    private CardRole role;
}
