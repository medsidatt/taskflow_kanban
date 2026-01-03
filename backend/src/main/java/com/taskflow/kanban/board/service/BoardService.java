package com.taskflow.kanban.board.service;

import com.taskflow.kanban.board.dto.BoardCreateDto;
import com.taskflow.kanban.board.dto.BoardDto;
import com.taskflow.kanban.board.dto.BoardUpdateDto;
import com.taskflow.kanban.board.entity.BoardRole;

import java.util.List;
import java.util.UUID;

public interface BoardService {
    BoardDto createBoard(BoardCreateDto createDto);
    BoardDto getBoardById(UUID id);
    void requireBoardAccess(UUID boardId);
    List<BoardDto> getBoardsByWorkspace(UUID workspaceId);
    List<BoardDto> getAllBoardsForCurrentUser();
    BoardDto updateBoard(UUID id, BoardUpdateDto updateDto);
    void deleteBoard(UUID id);
    void addMember(UUID boardId, UUID userId, BoardRole role);
    void removeMember(UUID boardId, UUID userId);
    void updateMemberRole(UUID boardId, UUID userId, BoardRole role);
}
