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
public class SearchColumnItemDto {
    private UUID id;
    private String name;
    private UUID boardId;
    private String boardName;
    private UUID workspaceId;
    private String workspaceName;
}
