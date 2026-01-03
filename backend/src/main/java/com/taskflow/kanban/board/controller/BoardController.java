package com.taskflow.kanban.board.controller;

import com.taskflow.kanban.board.dto.BoardCreateDto;
import com.taskflow.kanban.board.dto.BoardDto;
import com.taskflow.kanban.board.dto.BoardMemberUpdateDto;
import com.taskflow.kanban.board.dto.BoardUpdateDto;
import com.taskflow.kanban.board.dto.CardDto;
import com.taskflow.kanban.board.entity.BoardRole;
import com.taskflow.kanban.board.service.BoardService;
import com.taskflow.kanban.board.service.CardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;
    private final CardService cardService;

    @GetMapping("/{id}/archived-cards")
    @PreAuthorize("isAuthenticated()")
    public List<CardDto> getArchivedCards(@PathVariable UUID id) {
        return cardService.getArchivedCardsByBoard(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("isAuthenticated()")
    public BoardDto createBoard(@RequestBody @Valid BoardCreateDto createDto) {
        return boardService.createBoard(createDto);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<BoardDto> getBoards(@RequestParam(required = false) UUID workspaceId) {
        if (workspaceId != null) {
            return boardService.getBoardsByWorkspace(workspaceId);
        }
        return boardService.getAllBoardsForCurrentUser();
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public BoardDto getBoardById(@PathVariable UUID id) {
        return boardService.getBoardById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public BoardDto updateBoard(@PathVariable UUID id, @RequestBody BoardUpdateDto updateDto) {
        return boardService.updateBoard(id, updateDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("isAuthenticated()")
    public void deleteBoard(@PathVariable UUID id) {
        boardService.deleteBoard(id);
    }

    @PostMapping("/{id}/members/{userId}")
    @PreAuthorize("isAuthenticated()")
    public void addMember(@PathVariable UUID id, @PathVariable UUID userId) {
        // Default to MEMBER role when adding
        boardService.addMember(id, userId, BoardRole.MEMBER);
    }

    @DeleteMapping("/{id}/members/{userId}")
    @PreAuthorize("isAuthenticated()")
    public void removeMember(@PathVariable UUID id, @PathVariable UUID userId) {
        boardService.removeMember(id, userId);
    }

    @PutMapping("/{id}/members/{userId}")
    @PreAuthorize("isAuthenticated()")
    public void updateMemberRole(@PathVariable UUID id, @PathVariable UUID userId, @RequestBody @Valid BoardMemberUpdateDto updateDto) {
        boardService.updateMemberRole(id, userId, updateDto.getRole());
    }
}
