package com.taskflow.kanban.board.controller;

import com.taskflow.kanban.board.dto.CommentCreateDto;
import com.taskflow.kanban.board.dto.CommentDto;
import com.taskflow.kanban.board.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("isAuthenticated()")
    public CommentDto createComment(@RequestBody @Valid CommentCreateDto createDto) {
        return commentService.createComment(createDto);
    }

    @GetMapping("/cards/{cardId}")
    @PreAuthorize("isAuthenticated()")
    public List<CommentDto> getCommentsByCard(@PathVariable UUID cardId) {
        return commentService.getCommentsByCard(cardId);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public CommentDto updateComment(@PathVariable UUID id, @RequestBody String content) {
        return commentService.updateComment(id, content);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("isAuthenticated()")
    public void deleteComment(@PathVariable UUID id) {
        commentService.deleteComment(id);
    }
}
