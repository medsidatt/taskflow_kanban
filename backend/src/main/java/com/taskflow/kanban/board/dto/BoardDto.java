package com.taskflow.kanban.board.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardDto {
    private UUID id;
    private String name;
    private String description;
    private boolean archived;
    @JsonProperty("isPrivate")
    private boolean isPrivate;
    @JsonProperty("backgroundColor")
    private String backgroundColor;
    private UUID workspaceId;
    private String workspaceName;
    private int position;
    private Set<BoardMemberDto> members;
}
