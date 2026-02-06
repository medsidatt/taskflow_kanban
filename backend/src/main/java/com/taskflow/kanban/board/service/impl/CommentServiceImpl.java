package com.taskflow.kanban.board.service.impl;

import com.taskflow.kanban.board.dto.CommentCreateDto;
import com.taskflow.kanban.board.dto.CommentDto;
import com.taskflow.kanban.board.entity.Card;
import com.taskflow.kanban.board.entity.CardMember;
import com.taskflow.kanban.board.entity.Comment;
import com.taskflow.kanban.board.repository.CardRepository;
import com.taskflow.kanban.board.repository.CommentRepository;
import com.taskflow.kanban.board.service.ActivityService;
import com.taskflow.kanban.board.service.CommentService;
import com.taskflow.kanban.notification.NotificationType;
import com.taskflow.kanban.notification.service.NotificationService;
import com.taskflow.kanban.security.CustomUserDetails;
import com.taskflow.kanban.user.entity.User;
import com.taskflow.kanban.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final CardRepository cardRepository;
    private final UserRepository userRepository;
    private final ActivityService activityService;
    private final NotificationService notificationService;

    @Override
    public CommentDto createComment(CommentCreateDto createDto) {
        Card card = cardRepository.findById(createDto.getCardId())
                .orElseThrow(() -> new EntityNotFoundException("Card not found"));
        
        User author = userRepository.findById(getCurrentUserId())
                .orElseThrow(() -> new EntityNotFoundException("Author not found"));

        Comment comment = Comment.builder()
                .content(createDto.getContent())
                .card(card)
                .author(author)
                .build();
        
        Comment savedComment = commentRepository.save(comment);

        activityService.logActivity(card.getId(), "Card", "COMMENT", 
            "User '" + author.getUsername() + "' commented: '" + savedComment.getContent() + "'", author.getId());
        
        // Notify all card members about the new comment (except the author)
        for (CardMember member : card.getMembers()) {
            if (!member.getUser().getId().equals(author.getId())) {
                notificationService.createNotification(
                    member.getUser().getId(),
                    NotificationType.CARD_COMMENT,
                    "New comment on card",
                    author.getUsername() + " commented on \"" + card.getTitle() + "\"",
                    card.getId(),
                    "Card"
                );
            }
        }

        return toDto(savedComment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentDto> getCommentsByCard(UUID cardId) {
        return commentRepository.findByCardIdOrderByCreatedAtAsc(cardId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public CommentDto updateComment(UUID commentId, String content) {
        Comment comment = findComment(commentId);
        // TODO: Add security check to ensure only author or admin can edit
        comment.setContent(content);
        comment.setEdited(true);
        
        Comment updatedComment = commentRepository.save(comment);
        
        activityService.logActivity(comment.getCard().getId(), "Card", "COMMENT_EDIT", 
            "A comment was edited", getCurrentUserId());
            
        return toDto(updatedComment);
    }

    @Override
    public void deleteComment(UUID commentId) {
        Comment comment = findComment(commentId);
        // TODO: Add security check to ensure only author or admin can delete
        commentRepository.delete(comment);
        
        activityService.logActivity(comment.getCard().getId(), "Card", "COMMENT_DELETE", 
            "A comment was deleted", getCurrentUserId());
    }

    private Comment findComment(UUID id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found"));
    }

    private CommentDto toDto(Comment comment) {
        return CommentDto.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .edited(comment.isEdited())
                .cardId(comment.getCard().getId())
                .authorId(comment.getAuthor().getId())
                .authorUsername(comment.getAuthor().getUsername())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
    
    private UUID getCurrentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof CustomUserDetails) {
            return ((CustomUserDetails) principal).getId();
        }
        return null;
    }
}
