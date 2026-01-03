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
public class SearchCardItemDto {
    private UUID id;
    private String title;
    private UUID columnId;
    private String columnName;
    private UUID boardId;
    private String boardName;
    private UUID workspaceId;
    private String workspaceName;
}
