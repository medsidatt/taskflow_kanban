package com.taskflow.kanban.search.dto;

import com.taskflow.kanban.workspace.dto.WorkspaceDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResultDto {
    @Builder.Default
    private List<WorkspaceDto> workspaces = new ArrayList<>();
    @Builder.Default
    private List<SearchBoardItemDto> boards = new ArrayList<>();
    @Builder.Default
    private List<SearchColumnItemDto> columns = new ArrayList<>();
    @Builder.Default
    private List<SearchCardItemDto> cards = new ArrayList<>();
}
