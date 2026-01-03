package com.taskflow.kanban.board.service.impl;

import com.taskflow.kanban.board.dto.LabelCreateDto;
import com.taskflow.kanban.board.dto.LabelDto;
import com.taskflow.kanban.board.dto.LabelUpdateDto;
import com.taskflow.kanban.board.entity.Board;
import com.taskflow.kanban.board.entity.Card;
import com.taskflow.kanban.board.entity.Label;
import com.taskflow.kanban.board.repository.BoardRepository;
import com.taskflow.kanban.board.repository.CardRepository;
import com.taskflow.kanban.board.repository.LabelRepository;
import com.taskflow.kanban.board.service.LabelService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class LabelServiceImpl implements LabelService {

    private final LabelRepository labelRepository;
    private final BoardRepository boardRepository;
    private final CardRepository cardRepository;

    @Override
    public LabelDto createLabel(LabelCreateDto createDto) {
        Board board = boardRepository.findById(createDto.getBoardId())
                .orElseThrow(() -> new EntityNotFoundException("Board not found"));

        Label label = Label.builder()
                .name(createDto.getName())
                .color(createDto.getColor())
                .board(board)
                .build();

        return toDto(labelRepository.save(label));
    }

    @Override
    @Transactional(readOnly = true)
    public LabelDto getLabelById(UUID id) {
        return toDto(findLabel(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<LabelDto> getLabelsByBoard(UUID boardId) {
        return labelRepository.findByBoardId(boardId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public LabelDto updateLabel(UUID id, LabelUpdateDto updateDto) {
        Label label = findLabel(id);
        if (updateDto.getName() != null) label.setName(updateDto.getName());
        if (updateDto.getColor() != null) label.setColor(updateDto.getColor());
        return toDto(labelRepository.save(label));
    }

    @Override
    public void deleteLabel(UUID id) {
        labelRepository.delete(findLabel(id));
    }

    @Override
    public void addLabelToCard(UUID cardId, UUID labelId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new EntityNotFoundException("Card not found"));
        Label label = findLabel(labelId);
        card.getLabels().add(label);
        cardRepository.save(card);
    }

    @Override
    public void removeLabelFromCard(UUID cardId, UUID labelId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new EntityNotFoundException("Card not found"));
        card.getLabels().removeIf(label -> label.getId().equals(labelId));
        cardRepository.save(card);
    }

    private Label findLabel(UUID id) {
        return labelRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Label not found"));
    }

    private LabelDto toDto(Label label) {
        return LabelDto.builder()
                .id(label.getId())
                .name(label.getName())
                .color(label.getColor())
                .boardId(label.getBoard().getId())
                .build();
    }
}
