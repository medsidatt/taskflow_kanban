package com.taskflow.kanban.board.controller;

import com.taskflow.kanban.board.dto.ColumnCreateDto;
import com.taskflow.kanban.board.dto.ColumnDto;
import com.taskflow.kanban.board.dto.ColumnUpdateDto;
import com.taskflow.kanban.board.service.ColumnService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/columns")
@RequiredArgsConstructor
public class ColumnController {

    private final ColumnService columnService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("isAuthenticated()")
    public ColumnDto createColumn(@RequestBody @Valid ColumnCreateDto createDto) {
        return columnService.createColumn(createDto);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<ColumnDto> getColumnsByBoard(@RequestParam UUID boardId) {
        return columnService.getColumnsByBoard(boardId);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ColumnDto getColumnById(@PathVariable UUID id) {
        return columnService.getColumnById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ColumnDto updateColumn(@PathVariable UUID id, @RequestBody ColumnUpdateDto updateDto) {
        return columnService.updateColumn(id, updateDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("isAuthenticated()")
    public void deleteColumn(@PathVariable UUID id) {
        columnService.deleteColumn(id);
    }
}
