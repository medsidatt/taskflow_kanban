package com.taskflow.kanban.board.controller;

import com.taskflow.kanban.board.dto.LabelCreateDto;
import com.taskflow.kanban.board.dto.LabelDto;
import com.taskflow.kanban.board.dto.LabelUpdateDto;
import com.taskflow.kanban.board.service.LabelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/labels")
@RequiredArgsConstructor
public class LabelController {

    private final LabelService labelService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("isAuthenticated()")
    public LabelDto createLabel(@RequestBody @Valid LabelCreateDto createDto) {
        return labelService.createLabel(createDto);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<LabelDto> getLabelsByBoard(@RequestParam UUID boardId) {
        return labelService.getLabelsByBoard(boardId);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public LabelDto getLabelById(@PathVariable UUID id) {
        return labelService.getLabelById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public LabelDto updateLabel(@PathVariable UUID id, @RequestBody LabelUpdateDto updateDto) {
        return labelService.updateLabel(id, updateDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("isAuthenticated()")
    public void deleteLabel(@PathVariable UUID id) {
        labelService.deleteLabel(id);
    }

    @PostMapping("/cards/{cardId}/labels/{labelId}")
    @PreAuthorize("isAuthenticated()")
    public void addLabelToCard(@PathVariable UUID cardId, @PathVariable UUID labelId) {
        labelService.addLabelToCard(cardId, labelId);
    }

    @DeleteMapping("/cards/{cardId}/labels/{labelId}")
    @PreAuthorize("isAuthenticated()")
    public void removeLabelFromCard(@PathVariable UUID cardId, @PathVariable UUID labelId) {
        labelService.removeLabelFromCard(cardId, labelId);
    }
}
