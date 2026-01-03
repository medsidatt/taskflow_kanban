package com.taskflow.kanban.board.service.impl;

import com.taskflow.kanban.board.dto.ColumnCreateDto;
import com.taskflow.kanban.board.dto.ColumnDto;
import com.taskflow.kanban.board.dto.ColumnUpdateDto;
import com.taskflow.kanban.board.entity.Board;
import com.taskflow.kanban.board.entity.BoardColumn;
import com.taskflow.kanban.board.entity.Card;
import com.taskflow.kanban.board.repository.AttachmentRepository;
import com.taskflow.kanban.board.repository.BoardRepository;
import com.taskflow.kanban.board.repository.CardRepository;
import com.taskflow.kanban.board.repository.ColumnRepository;
import com.taskflow.kanban.board.repository.CommentRepository;
import com.taskflow.kanban.board.service.BoardService;
import com.taskflow.kanban.board.service.ColumnService;
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
public class ColumnServiceImpl implements ColumnService {

    private final ColumnRepository columnRepository;
    private final BoardRepository boardRepository;
    private final BoardService boardService;
    private final CardRepository cardRepository;
    private final AttachmentRepository attachmentRepository;
    private final CommentRepository commentRepository;

    @Override
    public ColumnDto createColumn(ColumnCreateDto createDto) {
        boardService.requireBoardAccess(createDto.getBoardId());
        Board board = boardRepository.findById(createDto.getBoardId())
                .orElseThrow(() -> new EntityNotFoundException("Board not found"));

        // Use provided position or calculate from existing columns
        int position = createDto.getPosition() != null ? createDto.getPosition() : 
                columnRepository.findByBoardIdOrderByPositionAsc(board.getId()).size();

        BoardColumn column = BoardColumn.builder()
                .name(createDto.getName())
                .wipLimit(createDto.getWipLimit())
                .board(board)
                .position(position)
                .build();

        return toDto(columnRepository.save(column));
    }

    @Override
    @Transactional(readOnly = true)
    public ColumnDto getColumnById(UUID id) {
        return toDto(findColumn(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ColumnDto> getColumnsByBoard(UUID boardId) {
        boardService.requireBoardAccess(boardId);
        return columnRepository.findByBoardIdOrderByPositionAsc(boardId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ColumnDto updateColumn(UUID id, ColumnUpdateDto updateDto) {
        BoardColumn column = findColumn(id);
        if (updateDto.getName() != null) column.setName(updateDto.getName());
        if (updateDto.getWipLimit() != null) column.setWipLimit(updateDto.getWipLimit());
        if (updateDto.getPosition() != null) column.setPosition(updateDto.getPosition());
        if (updateDto.getArchived() != null) column.setArchived(updateDto.getArchived());

        return toDto(columnRepository.save(column));
    }

    @Override
    public void deleteColumn(UUID id) {
        BoardColumn columnToDelete = findColumn(id);
        UUID boardId = columnToDelete.getBoard().getId();
        int oldPosition = columnToDelete.getPosition();

        // Delete in dependency order: cards (attachments, comments) -> column
        List<Card> cards = cardRepository.findByColumnIdOrderByPositionAsc(id);
        for (Card card : cards) {
            attachmentRepository.deleteAll(attachmentRepository.findByCardId(card.getId()));
            commentRepository.deleteAll(commentRepository.findByCardIdOrderByCreatedAtAsc(card.getId()));
            cardRepository.delete(card);
        }
        columnRepository.delete(columnToDelete);

        List<BoardColumn> columnsToUpdate = columnRepository.findByBoardIdOrderByPositionAsc(boardId);
        for (BoardColumn column : columnsToUpdate) {
            if (column.getPosition() > oldPosition) {
                column.setPosition(column.getPosition() - 1);
            }
        }
        columnRepository.saveAll(columnsToUpdate);
    }

    private BoardColumn findColumn(UUID id) {
        return columnRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Column not found"));
    }

    private ColumnDto toDto(BoardColumn column) {
        return ColumnDto.builder()
                .id(column.getId())
                .name(column.getName())
                .position(column.getPosition())
                .wipLimit(column.getWipLimit())
                .archived(column.isArchived())
                .boardId(column.getBoard().getId())
                .build();
    }
}
