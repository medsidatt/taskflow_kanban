package com.taskflow.kanban.board.service;

import com.taskflow.kanban.board.dto.ColumnCreateDto;
import com.taskflow.kanban.board.dto.ColumnDto;
import com.taskflow.kanban.board.dto.ColumnUpdateDto;

import java.util.List;
import java.util.UUID;

public interface ColumnService {
    ColumnDto createColumn(ColumnCreateDto createDto);
    ColumnDto getColumnById(UUID id);
    List<ColumnDto> getColumnsByBoard(UUID boardId);
    ColumnDto updateColumn(UUID id, ColumnUpdateDto updateDto);
    void deleteColumn(UUID id);
}
