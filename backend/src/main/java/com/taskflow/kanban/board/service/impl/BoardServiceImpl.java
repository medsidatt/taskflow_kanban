package com.taskflow.kanban.board.service.impl;

import com.taskflow.kanban.board.dto.BoardCreateDto;
import com.taskflow.kanban.board.dto.BoardDto;
import com.taskflow.kanban.board.dto.BoardMemberDto;
import com.taskflow.kanban.board.dto.BoardUpdateDto;
import com.taskflow.kanban.board.entity.Board;
import com.taskflow.kanban.board.entity.BoardColumn;
import com.taskflow.kanban.board.entity.BoardMember;
import com.taskflow.kanban.board.entity.BoardRole;
import com.taskflow.kanban.board.entity.Card;
import com.taskflow.kanban.board.repository.AttachmentRepository;
import com.taskflow.kanban.board.repository.BoardMemberRepository;
import com.taskflow.kanban.board.repository.BoardRepository;
import com.taskflow.kanban.board.repository.CardRepository;
import com.taskflow.kanban.board.repository.ColumnRepository;
import com.taskflow.kanban.board.repository.CommentRepository;
import com.taskflow.kanban.board.repository.LabelRepository;
import com.taskflow.kanban.board.service.BoardService;
import com.taskflow.kanban.security.CustomUserDetails;
import com.taskflow.kanban.user.entity.User;
import com.taskflow.kanban.user.repository.UserRepository;
import com.taskflow.kanban.workspace.repository.WorkspaceMemberRepository;
import com.taskflow.kanban.workspace.entity.Workspace;
import com.taskflow.kanban.workspace.repository.WorkspaceRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;
    private final BoardMemberRepository boardMemberRepository;
    private final ColumnRepository columnRepository;
    private final CardRepository cardRepository;
    private final LabelRepository labelRepository;
    private final AttachmentRepository attachmentRepository;
    private final CommentRepository commentRepository;
    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final UserRepository userRepository;

    @Override
    public BoardDto createBoard(BoardCreateDto createDto) {
        Workspace workspace = workspaceRepository.findById(createDto.getWorkspaceId())
                .orElseThrow(() -> new EntityNotFoundException("Workspace not found"));
        
        User owner = userRepository.findById(getCurrentUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Board board = Board.builder()
                .name(createDto.getName())
                .description(createDto.getDescription())
                .backgroundColor(createDto.getBackgroundColor())
                .isPrivate(createDto.isPrivate())
                .workspace(workspace)
                .build();
        
        BoardMember ownerMember = BoardMember.builder()
                .board(board)
                .user(owner)
                .role(BoardRole.OWNER)
                .build();
        
        board.getMembers().add(ownerMember);

        return toDto(boardRepository.save(board));
    }

    @Override
    public void addMember(UUID boardId, UUID userId, BoardRole role) {
        checkPermission(boardId, BoardRole.ADMIN);
        Board board = findBoard(boardId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        BoardMember newMember = BoardMember.builder()
                .board(board)
                .user(user)
                .role(role)
                .build();
        
        board.getMembers().add(newMember);
        boardRepository.save(board);
    }

    @Override
    public void removeMember(UUID boardId, UUID userId) {
        checkPermission(boardId, BoardRole.ADMIN);
        Board board = findBoard(boardId);
        board.getMembers().removeIf(member -> member.getUser().getId().equals(userId));
        boardRepository.save(board);
    }

    @Override
    public void updateMemberRole(UUID boardId, UUID userId, BoardRole role) {
        checkPermission(boardId, BoardRole.ADMIN);
        BoardMember member = boardMemberRepository.findByBoardIdAndUserId(boardId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Board member not found"));
        member.setRole(role);
        boardMemberRepository.save(member);
    }

    // --- Other methods ---

    @Override
    @Transactional(readOnly = true)
    public BoardDto getBoardById(UUID id) {
        Board board = findBoard(id);
        requireBoardAccess(board);
        return toDto(board);
    }

    @Override
    public void requireBoardAccess(UUID boardId) {
        requireBoardAccess(findBoard(boardId));
    }

    private void requireBoardAccess(Board board) {
        UUID uid = getCurrentUserId();
        if (uid == null) throw new AccessDeniedException("Not authenticated");
        UUID workspaceId = board.getWorkspace().getId();
        if (workspaceMemberRepository.findByWorkspaceIdAndUserId(workspaceId, uid).isPresent()) return;
        if (boardMemberRepository.findByBoardIdAndUserId(board.getId(), uid).isPresent()) return;
        if (cardRepository.countCardMembersOnBoard(board.getId(), uid) > 0) return;
        throw new AccessDeniedException("You do not have access to this board");
    }

    @Override
    @Transactional(readOnly = true)
    public List<BoardDto> getBoardsByWorkspace(UUID workspaceId) {
        UUID uid = getCurrentUserId();
        if (uid == null) throw new AccessDeniedException("Not authenticated");
        workspaceMemberRepository.findByWorkspaceIdAndUserId(workspaceId, uid)
                .orElseThrow(() -> new AccessDeniedException("Not a member of this workspace"));
        return boardRepository.findByWorkspaceId(workspaceId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BoardDto> getAllBoardsForCurrentUser() {
        UUID uid = getCurrentUserId();
        if (uid == null) return List.of();
        List<UUID> workspaceIds = workspaceMemberRepository.findWorkspaceIdsByUserId(uid);
        List<Board> fromWorkspace = workspaceIds.isEmpty() ? List.of() : boardRepository.findByWorkspace_IdIn(workspaceIds);
        List<Board> fromBoardMembership = boardRepository.findByBoardMemberUserId(uid);
        List<Board> fromCardMembership = boardRepository.findBoardsByCardMemberUserId(uid);
        Set<UUID> seen = new HashSet<>();
        List<BoardDto> result = new ArrayList<>();
        for (Board b : fromWorkspace) { if (seen.add(b.getId())) result.add(toDto(b)); }
        for (Board b : fromBoardMembership) { if (seen.add(b.getId())) result.add(toDto(b)); }
        for (Board b : fromCardMembership) { if (seen.add(b.getId())) result.add(toDto(b)); }
        return result;
    }

    @Override
    public BoardDto updateBoard(UUID id, BoardUpdateDto updateDto) {
        checkPermission(id, BoardRole.ADMIN);
        Board board = findBoard(id);
        if (updateDto.getName() != null) board.setName(updateDto.getName());
        if (updateDto.getDescription() != null) board.setDescription(updateDto.getDescription());
        if (updateDto.getIsPrivate() != null) board.setPrivate(updateDto.getIsPrivate());
        if (updateDto.getArchived() != null) board.setArchived(updateDto.getArchived());
        if (updateDto.getBackgroundColor() != null) board.setBackgroundColor(updateDto.getBackgroundColor());
        
        return toDto(boardRepository.save(board));
    }

    @Override
    public void deleteBoard(UUID id) {
        checkPermission(id, BoardRole.OWNER);
        Board board = findBoard(id);

        // Delete in dependency order to satisfy foreign keys: cards (and their attachments, comments, card_members, card_labels) -> columns -> labels -> board_members -> board
        List<BoardColumn> columns = columnRepository.findByBoardIdOrderByPositionAsc(id);
        for (BoardColumn col : columns) {
            List<Card> cards = cardRepository.findByColumnIdOrderByPositionAsc(col.getId());
            for (Card card : cards) {
                attachmentRepository.deleteAll(attachmentRepository.findByCardId(card.getId()));
                commentRepository.deleteAll(commentRepository.findByCardIdOrderByCreatedAtAsc(card.getId()));
                cardRepository.delete(card);
            }
            columnRepository.delete(col);
        }
        labelRepository.deleteAll(labelRepository.findByBoardId(id));
        boardMemberRepository.deleteAll(boardMemberRepository.findByBoardId(id));
        boardRepository.delete(board);
    }

    private Board findBoard(UUID id) {
        return boardRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Board not found"));
    }

    private BoardDto toDto(Board board) {
        Set<BoardMemberDto> memberDtos = (board.getMembers() == null || board.getMembers().isEmpty())
                ? Set.of()
                : board.getMembers().stream()
                        .map(m -> BoardMemberDto.builder()
                                .id(m.getId())
                                .userId(m.getUser().getId())
                                .username(m.getUser().getUsername())
                                .email(m.getUser().getEmail())
                                .role(m.getRole())
                                .build())
                        .collect(Collectors.toSet());
        return BoardDto.builder()
                .id(board.getId())
                .name(board.getName())
                .description(board.getDescription())
                .archived(board.isArchived())
                .isPrivate(board.isPrivate())
                .backgroundColor(board.getBackgroundColor())
                .workspaceId(board.getWorkspace().getId())
                .workspaceName(board.getWorkspace() != null ? board.getWorkspace().getName() : null)
                .position(board.getPosition())
                .members(memberDtos)
                .build();
    }
    
    private UUID getCurrentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof CustomUserDetails) {
            return ((CustomUserDetails) principal).getId();
        }
        return null;
    }

    private void checkPermission(UUID boardId, BoardRole requiredRole) {
        UUID currentUserId = getCurrentUserId();
        BoardMember member = boardMemberRepository.findByBoardIdAndUserId(boardId, currentUserId)
                .orElseThrow(() -> new AccessDeniedException("You are not a member of this board"));
        
        // OWNER has all permissions, ADMIN has admin and below, etc.
        if (member.getRole().ordinal() > requiredRole.ordinal()) {
            throw new AccessDeniedException("You do not have the required permissions for this action");
        }
    }
}
