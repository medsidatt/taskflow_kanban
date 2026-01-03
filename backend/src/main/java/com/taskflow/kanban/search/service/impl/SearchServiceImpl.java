package com.taskflow.kanban.search.service.impl;

import com.taskflow.kanban.board.entity.Board;
import com.taskflow.kanban.board.entity.BoardColumn;
import com.taskflow.kanban.board.entity.Card;
import com.taskflow.kanban.board.repository.BoardRepository;
import com.taskflow.kanban.board.repository.CardRepository;
import com.taskflow.kanban.board.repository.ColumnRepository;
import com.taskflow.kanban.search.dto.SearchBoardItemDto;
import com.taskflow.kanban.search.dto.SearchCardItemDto;
import com.taskflow.kanban.search.dto.SearchColumnItemDto;
import com.taskflow.kanban.search.dto.SearchResultDto;
import com.taskflow.kanban.search.service.SearchService;
import com.taskflow.kanban.security.CustomUserDetails;
import com.taskflow.kanban.workspace.dto.WorkspaceDto;
import com.taskflow.kanban.workspace.entity.Workspace;
import com.taskflow.kanban.workspace.repository.WorkspaceMemberRepository;
import com.taskflow.kanban.workspace.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final WorkspaceRepository workspaceRepository;
    private final BoardRepository boardRepository;
    private final ColumnRepository columnRepository;
    private final CardRepository cardRepository;

    @Override
    @Transactional(readOnly = true)
    public SearchResultDto search(String q) {
        String trimmed = q != null ? q.trim() : "";
        if (trimmed.isEmpty()) {
            return SearchResultDto.builder().build();
        }

        UUID userId = getCurrentUserId();
        List<UUID> workspaceIds = workspaceMemberRepository.findWorkspaceIdsByUserId(userId);
        if (workspaceIds == null || workspaceIds.isEmpty()) {
            return SearchResultDto.builder().build();
        }

        List<Workspace> workspaces = workspaceRepository.searchByUserWorkspaces(trimmed, workspaceIds);
        List<Board> boards = boardRepository.searchByUserWorkspaces(trimmed, workspaceIds);
        List<BoardColumn> columns = columnRepository.searchByUserWorkspaces(trimmed, workspaceIds);
        List<Card> cards = cardRepository.searchByUserWorkspaces(trimmed, workspaceIds);

        return SearchResultDto.builder()
                .workspaces(workspaces.stream().map(this::toWorkspaceDto).collect(Collectors.toList()))
                .boards(boards.stream().map(this::toSearchBoardItem).collect(Collectors.toList()))
                .columns(columns.stream().map(this::toSearchColumnItem).collect(Collectors.toList()))
                .cards(cards.stream().map(this::toSearchCardItem).collect(Collectors.toList()))
                .build();
    }

    private UUID getCurrentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof CustomUserDetails) {
            return ((CustomUserDetails) principal).getId();
        }
        throw new IllegalStateException("User not authenticated");
    }

    private WorkspaceDto toWorkspaceDto(Workspace w) {
        return WorkspaceDto.builder()
                .id(w.getId())
                .name(w.getName())
                .description(w.getDescription())
                .isPrivate(w.isPrivate())
                .build();
    }

    private SearchBoardItemDto toSearchBoardItem(Board b) {
        return SearchBoardItemDto.builder()
                .id(b.getId())
                .name(b.getName())
                .description(b.getDescription())
                .workspaceId(b.getWorkspace().getId())
                .workspaceName(b.getWorkspace().getName())
                .build();
    }

    private SearchColumnItemDto toSearchColumnItem(BoardColumn c) {
        Board b = c.getBoard();
        return SearchColumnItemDto.builder()
                .id(c.getId())
                .name(c.getName())
                .boardId(b.getId())
                .boardName(b.getName())
                .workspaceId(b.getWorkspace().getId())
                .workspaceName(b.getWorkspace().getName())
                .build();
    }

    private SearchCardItemDto toSearchCardItem(Card c) {
        BoardColumn col = c.getColumn();
        Board b = col.getBoard();
        return SearchCardItemDto.builder()
                .id(c.getId())
                .title(c.getTitle())
                .columnId(col.getId())
                .columnName(col.getName())
                .boardId(b.getId())
                .boardName(b.getName())
                .workspaceId(b.getWorkspace().getId())
                .workspaceName(b.getWorkspace().getName())
                .build();
    }
}
