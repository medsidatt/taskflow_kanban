package com.taskflow.kanban.board.service;

import com.taskflow.kanban.board.dto.LabelCreateDto;
import com.taskflow.kanban.board.dto.LabelDto;
import com.taskflow.kanban.board.dto.LabelUpdateDto;

import java.util.List;
import java.util.UUID;

public interface LabelService {
    LabelDto createLabel(LabelCreateDto createDto);
    LabelDto getLabelById(UUID id);
    List<LabelDto> getLabelsByBoard(UUID boardId);
    LabelDto updateLabel(UUID id, LabelUpdateDto updateDto);
    void deleteLabel(UUID id);
    void addLabelToCard(UUID cardId, UUID labelId);
    void removeLabelFromCard(UUID cardId, UUID labelId);
}
