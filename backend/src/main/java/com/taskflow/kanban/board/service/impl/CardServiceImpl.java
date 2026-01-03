package com.taskflow.kanban.board.service.impl;

import com.taskflow.kanban.board.dto.*;
import com.taskflow.kanban.board.entity.BoardColumn;
import com.taskflow.kanban.board.entity.Card;
import com.taskflow.kanban.board.entity.CardMember;
import com.taskflow.kanban.board.entity.CardRole;
import com.taskflow.kanban.board.repository.BoardMemberRepository;
import com.taskflow.kanban.board.repository.CardRepository;
import com.taskflow.kanban.board.repository.ColumnRepository;
import com.taskflow.kanban.board.service.ActivityService;
import com.taskflow.kanban.board.service.CardService;
import com.taskflow.kanban.security.CustomUserDetails;
import com.taskflow.kanban.user.entity.User;
import com.taskflow.kanban.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CardServiceImpl implements CardService {

    private final CardRepository cardRepository;
    private final ColumnRepository columnRepository;
    private final BoardMemberRepository boardMemberRepository;
    private final UserRepository userRepository;
    private final ActivityService activityService;

    @Override
    public CardDto createCard(CardCreateDto createDto) {
        BoardColumn column = columnRepository.findById(createDto.getColumnId())
                .orElseThrow(() -> new EntityNotFoundException("Column not found"));

        // Use provided position or calculate from existing cards
        int position = createDto.getPosition() != null ? createDto.getPosition() : 
                cardRepository.findByColumnIdOrderByPositionAsc(column.getId()).size();

        Card card = Card.builder()
                .title(createDto.getTitle())
                .description(createDto.getDescription())
                .dueDate(createDto.getDueDate())
                .startDate(createDto.getStartDate())
                .priority(createDto.getPriority())
                .column(column)
                .position(position)
                .build();
        
        Card savedCard = cardRepository.save(card);

        activityService.logActivity(savedCard.getId(), "Card", "CREATE", 
            "Card '" + savedCard.getTitle() + "' was created in column '" + column.getName() + "'",
                getCurrentUserId());

        return toDto(savedCard);
    }

    @Override
    public void deleteCard(UUID id) {
        Card cardToDelete = findCard(id);
        UUID columnId = cardToDelete.getColumn().getId();
        int oldPosition = cardToDelete.getPosition();

        cardRepository.delete(cardToDelete);

        List<Card> cardsToShift = cardRepository.findByColumnIdAndPositionGreaterThan(columnId, oldPosition);
        for (Card card : cardsToShift) {
            card.setPosition(card.getPosition() - 1);
        }
        cardRepository.saveAll(cardsToShift);
        
        activityService.logActivity(id, "Card", "DELETE", 
            "Card '" + cardToDelete.getTitle() + "' was deleted", getCurrentUserId());
    }

    @Override
    public void moveCard(UUID cardId, CardMoveDto moveDto) {
        Card cardToMove = findCard(cardId);
        BoardColumn sourceColumn = cardToMove.getColumn();
        BoardColumn targetColumn = columnRepository.findById(moveDto.getTargetColumnId())
                .orElseThrow(() -> new EntityNotFoundException("Target column not found"));

        int oldPosition = cardToMove.getPosition();
        int newPosition = moveDto.getNewPosition();

        if (sourceColumn.getId().equals(targetColumn.getId())) {
            // --- Move within the same column ---
            List<Card> cards = cardRepository.findByColumnIdOrderByPositionAsc(sourceColumn.getId());
            cards.remove(cardToMove);
            cards.add(newPosition, cardToMove);
            
            for (int i = 0; i < cards.size(); i++) {
                cards.get(i).setPosition(i);
            }
            cardRepository.saveAll(cards);

        } else {
            // --- Move to a different column ---
            // 1. Remove from source column and shift remaining cards
            List<Card> sourceCards = cardRepository.findByColumnIdOrderByPositionAsc(sourceColumn.getId());
            sourceCards.remove(cardToMove);
            for (int i = 0; i < sourceCards.size(); i++) {
                sourceCards.get(i).setPosition(i);
            }
            cardRepository.saveAll(sourceCards);

            // 2. Add to target column and shift subsequent cards
            List<Card> targetCards = cardRepository.findByColumnIdOrderByPositionAsc(targetColumn.getId());
            targetCards.add(newPosition, cardToMove);
            cardToMove.setColumn(targetColumn);

            for (int i = 0; i < targetCards.size(); i++) {
                targetCards.get(i).setPosition(i);
            }
            cardRepository.saveAll(targetCards);
        }
        
        activityService.logActivity(cardId, "Card", "MOVE", 
            "Card '" + cardToMove.getTitle() + "' moved from '" + sourceColumn.getName() + "' to '" + targetColumn.getName() + "'", getCurrentUserId());
    }
    
    // --- Other methods ---

    @Override
    @Transactional(readOnly = true)
    public CardDto getCardById(UUID id) {
        return toDto(findCard(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CardDto> getCardsByColumn(UUID columnId) {
        return cardRepository.findByColumnIdOrderByPositionAsc(columnId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CardDto> getArchivedCardsByBoard(UUID boardId) {
        UUID uid = getCurrentUserId();
        if (uid == null) throw new AccessDeniedException("Not authenticated");
        boardMemberRepository.findByBoardIdAndUserId(boardId, uid)
                .orElseThrow(() -> new AccessDeniedException("Not a member of this board"));
        List<Card> cards = cardRepository.findByColumn_Board_IdAndArchivedTrue(boardId);
        return cards.stream().sorted((a, b) -> {
            int cp = Integer.compare(a.getColumn().getPosition(), b.getColumn().getPosition());
            return cp != 0 ? cp : Integer.compare(a.getPosition(), b.getPosition());
        }).map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public CardDto updateCard(UUID id, CardUpdateDto updateDto) {
        Card card = findCard(id);
        // Basic field updates
        if (updateDto.getTitle() != null) card.setTitle(updateDto.getTitle());
        if (updateDto.getDescription() != null) card.setDescription(updateDto.getDescription());
        if (updateDto.getArchived() != null) card.setArchived(updateDto.getArchived());
        if (updateDto.getAchieved() != null) card.setAchieved(updateDto.getAchieved());
        if (Boolean.TRUE.equals(updateDto.getClearDueDate())) card.setDueDate(null);
        else if (updateDto.getDueDate() != null) card.setDueDate(updateDto.getDueDate());
        if (updateDto.getStartDate() != null) card.setStartDate(updateDto.getStartDate());
        if (updateDto.getPriority() != null) card.setPriority(updateDto.getPriority());
        
        Card updatedCard = cardRepository.save(card);
        
        activityService.logActivity(id, "Card", "UPDATE", 
            "Card '" + updatedCard.getTitle() + "' was updated", getCurrentUserId());
            
        return toDto(updatedCard);
    }

    @Override
    public void addMember(UUID cardId, UUID userId, CardRole role) {
        Card card = findCard(cardId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        
        Optional<CardMember> existingMember = card.getMembers().stream()
                .filter(m -> m.getUser().getId().equals(userId))
                .findFirst();

        if (existingMember.isPresent()) {
            existingMember.get().setRole(role);
        } else {
            CardMember member = CardMember.builder()
                    .card(card)
                    .user(user)
                    .role(role)
                    .build();
            card.getMembers().add(member);
        }
        cardRepository.save(card);
        
        activityService.logActivity(cardId, "Card", "UPDATE", 
            "User '" + user.getUsername() + "' was assigned to card '" + card.getTitle() + "' as " + role, getCurrentUserId());
    }

    @Override
    public void removeMember(UUID cardId, UUID userId) {
        Card card = findCard(cardId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        
        card.getMembers().removeIf(m -> m.getUser().getId().equals(userId));
        cardRepository.save(card);
        
        activityService.logActivity(cardId, "Card", "UPDATE", 
            "User '" + user.getUsername() + "' was unassigned from card '" + card.getTitle() + "'", getCurrentUserId());
    }

    private Card findCard(UUID id) {
        return cardRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Card not found"));
    }

    private CardDto toDto(Card card) {
        return CardDto.builder()
                .id(card.getId())
                .title(card.getTitle())
                .description(card.getDescription())
                .position(card.getPosition())
                .archived(card.isArchived())
                .achieved(card.isAchieved())
                .dueDate(card.getDueDate())
                .startDate(card.getStartDate())
                .priority(card.getPriority())
                .columnId(card.getColumn().getId())
                .members(card.getMembers().stream()
                        .map(m -> CardMemberDto.builder()
                                .userId(m.getUser().getId())
                                .username(m.getUser().getUsername())
                                .email(m.getUser().getEmail())
                                .role(m.getRole())
                                .build())
                        .collect(Collectors.toSet()))
                .labels(card.getLabels() == null || card.getLabels().isEmpty()
                        ? java.util.Set.of()
                        : card.getLabels().stream()
                                .map(l -> LabelDto.builder()
                                        .id(l.getId())
                                        .name(l.getName())
                                        .color(l.getColor())
                                        .boardId(l.getBoard() != null ? l.getBoard().getId() : null)
                                        .build())
                                .collect(Collectors.toSet()))
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
