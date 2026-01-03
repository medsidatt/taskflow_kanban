package com.taskflow.kanban.board.controller;

import com.taskflow.kanban.board.dto.CardCreateDto;
import com.taskflow.kanban.board.dto.CardDto;
import com.taskflow.kanban.board.dto.CardMoveDto;
import com.taskflow.kanban.board.dto.CardUpdateDto;
import com.taskflow.kanban.board.entity.CardRole;
import com.taskflow.kanban.board.service.CardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/cards")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("isAuthenticated()")
    public CardDto createCard(@RequestBody @Valid CardCreateDto createDto) {
        return cardService.createCard(createDto);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<CardDto> getCardsByColumn(@RequestParam UUID columnId) {
        return cardService.getCardsByColumn(columnId);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public CardDto getCardById(@PathVariable UUID id) {
        return cardService.getCardById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public CardDto updateCard(@PathVariable UUID id, @RequestBody CardUpdateDto updateDto) {
        return cardService.updateCard(id, updateDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("isAuthenticated()")
    public void deleteCard(@PathVariable UUID id) {
        cardService.deleteCard(id);
    }
    
    @PutMapping("/{id}/move")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("isAuthenticated()")
    public void moveCard(@PathVariable UUID id, @RequestBody @Valid CardMoveDto moveDto) {
        cardService.moveCard(id, moveDto);
    }

    @PostMapping("/{id}/assignees/{userId}")
    @PreAuthorize("isAuthenticated()")
    public void addAssignee(@PathVariable UUID id, @PathVariable UUID userId) {
        cardService.addMember(id, userId, CardRole.ASSIGNEE);
    }

    @DeleteMapping("/{id}/assignees/{userId}")
    @PreAuthorize("isAuthenticated()")
    public void removeAssignee(@PathVariable UUID id, @PathVariable UUID userId) {
        cardService.removeMember(id, userId);
    }

    @PutMapping("/{id}/members/{userId}")
    @PreAuthorize("isAuthenticated()")
    public void updateMemberRole(@PathVariable UUID id, @PathVariable UUID userId, @RequestParam CardRole role) {
        cardService.addMember(id, userId, role);
    }
}
