package com.taskflow.kanban.board.service;

import com.taskflow.kanban.board.dto.CardCreateDto;
import com.taskflow.kanban.board.dto.CardDto;
import com.taskflow.kanban.board.dto.CardMoveDto;
import com.taskflow.kanban.board.dto.CardUpdateDto;
import com.taskflow.kanban.board.entity.CardRole;

import java.util.List;
import java.util.UUID;

public interface CardService {
    CardDto createCard(CardCreateDto createDto);
    CardDto getCardById(UUID id);
    List<CardDto> getCardsByColumn(UUID columnId);
    List<CardDto> getArchivedCardsByBoard(UUID boardId);
    CardDto updateCard(UUID id, CardUpdateDto updateDto);
    void deleteCard(UUID id);
    void moveCard(UUID cardId, CardMoveDto moveDto);
    void addMember(UUID cardId, UUID userId, CardRole role);
    void removeMember(UUID cardId, UUID userId);
}
