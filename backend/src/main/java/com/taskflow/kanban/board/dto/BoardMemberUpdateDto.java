package com.taskflow.kanban.board.dto;

import com.taskflow.kanban.board.entity.BoardRole;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BoardMemberUpdateDto {
    @NotNull(message = "Role is required")
    private BoardRole role;
}
