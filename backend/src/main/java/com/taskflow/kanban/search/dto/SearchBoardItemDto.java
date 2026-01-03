package com.taskflow.kanban.search.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchBoardItemDto {
    private UUID id;
    private String name;
    private String description;
    private UUID workspaceId;
    private String workspaceName;
}
