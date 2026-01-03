package com.taskflow.kanban.board.service;

import com.taskflow.kanban.board.dto.CommentCreateDto;
import com.taskflow.kanban.board.dto.CommentDto;

import java.util.List;
import java.util.UUID;

public interface CommentService {
    CommentDto createComment(CommentCreateDto createDto);
    List<CommentDto> getCommentsByCard(UUID cardId);
    CommentDto updateComment(UUID commentId, String content);
    void deleteComment(UUID commentId);
}
