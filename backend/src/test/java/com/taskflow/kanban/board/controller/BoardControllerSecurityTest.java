package com.taskflow.kanban.board.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskflow.kanban.board.dto.BoardCreateDto;
import com.taskflow.kanban.board.dto.CardCreateDto;
import com.taskflow.kanban.board.dto.CardMoveDto;
import com.taskflow.kanban.board.dto.ColumnCreateDto;
import com.taskflow.kanban.board.dto.LabelCreateDto;
import com.taskflow.kanban.board.entity.Board;
import com.taskflow.kanban.board.entity.BoardColumn;
import com.taskflow.kanban.board.entity.BoardMember;
import com.taskflow.kanban.board.entity.BoardRole;
import com.taskflow.kanban.board.entity.Card;
import com.taskflow.kanban.board.entity.Label;
import com.taskflow.kanban.board.repository.BoardMemberRepository;
import com.taskflow.kanban.board.repository.BoardRepository;
import com.taskflow.kanban.board.repository.CardRepository;
import com.taskflow.kanban.board.repository.ColumnRepository;
import com.taskflow.kanban.board.repository.LabelRepository;
import com.taskflow.kanban.security.CustomUserDetails;
import com.taskflow.kanban.security.JwtService;
import com.taskflow.kanban.user.entity.Role;
import com.taskflow.kanban.user.entity.User;
import com.taskflow.kanban.user.repository.RoleRepository;
import com.taskflow.kanban.user.repository.UserRepository;
import com.taskflow.kanban.workspace.entity.Workspace;
import com.taskflow.kanban.workspace.entity.WorkspaceMember;
import com.taskflow.kanban.workspace.entity.WorkspaceRole;
import com.taskflow.kanban.workspace.repository.WorkspaceMemberRepository;
import com.taskflow.kanban.workspace.repository.WorkspaceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class BoardControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private WorkspaceMemberRepository workspaceMemberRepository;

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private BoardMemberRepository boardMemberRepository;

    @Autowired
    private ColumnRepository columnRepository;

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private LabelRepository labelRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    private String userToken;
    private User user;
    private Workspace workspace;
    private Board board;

    @BeforeEach
    void setUp() {
        Role userRole = roleRepository.findByName("USER").orElseGet(() -> roleRepository.save(new Role("USER")));

        user = User.builder()
                .username("board_user")
                .email("board@example.com")
                .password(passwordEncoder.encode("password"))
                .active(true)
                .roles(Set.of(userRole))
                .build();
        user = userRepository.save(user);
        userToken = "Bearer " + jwtService.generateToken(new CustomUserDetails(user));

        workspace = Workspace.builder()
                .name("Test Workspace")
                .isPrivate(false)
                .build();
        workspace = workspaceRepository.save(workspace);
        workspaceMemberRepository.save(WorkspaceMember.builder()
                .workspace(workspace)
                .user(user)
                .role(WorkspaceRole.OWNER)
                .build());

        board = Board.builder().name("Test Board").workspace(workspace).build();
        board = boardRepository.save(board);
        boardMemberRepository.save(BoardMember.builder()
                .board(board)
                .user(user)
                .role(BoardRole.OWNER)
                .build());
    }

    @Test
    void createBoard_success() throws Exception {
        BoardCreateDto dto = new BoardCreateDto();
        dto.setName("My Board");
        dto.setWorkspaceId(workspace.getId());

        mockMvc.perform(post("/boards")
                        .header("Authorization", userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("My Board"));
    }

    @Test
    void createColumn_success() throws Exception {
        ColumnCreateDto dto = new ColumnCreateDto();
        dto.setName("My Column");
        dto.setBoardId(board.getId());

        mockMvc.perform(post("/columns")
                        .header("Authorization", userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("My Column"));
    }

    @Test
    void createCard_success() throws Exception {
        BoardColumn column = columnRepository.save(BoardColumn.builder().name("Test Column").board(board).position(0).build());

        CardCreateDto dto = new CardCreateDto();
        dto.setTitle("My Card");
        dto.setColumnId(column.getId());

        mockMvc.perform(post("/cards")
                        .header("Authorization", userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("My Card"));
    }

    @Test
    void createLabel_success() throws Exception {
        LabelCreateDto dto = new LabelCreateDto();
        dto.setName("My Label");
        dto.setColor("#ff0000");
        dto.setBoardId(board.getId());

        mockMvc.perform(post("/labels")
                        .header("Authorization", userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("My Label"));
    }

    @Test
    void addLabelToCard_success() throws Exception {
        BoardColumn column = columnRepository.save(BoardColumn.builder().name("Test Column").board(board).position(0).build());
        Card card = cardRepository.save(Card.builder().title("Test Card").column(column).position(0).build());
        Label label = labelRepository.save(Label.builder().name("Test Label").board(board).build());

        mockMvc.perform(post("/labels/cards/" + card.getId() + "/labels/" + label.getId())
                        .header("Authorization", userToken))
                .andExpect(status().isOk());
    }

    @Test
    void moveCard_withinSameColumn() throws Exception {
        BoardColumn column = columnRepository.save(BoardColumn.builder().name("Test Column").board(board).position(0).build());
        Card card1 = cardRepository.save(Card.builder().title("Card 1").column(column).position(0).build());
        Card card2 = cardRepository.save(Card.builder().title("Card 2").column(column).position(1).build());
        Card card3 = cardRepository.save(Card.builder().title("Card 3").column(column).position(2).build());

        CardMoveDto moveDto = new CardMoveDto();
        moveDto.setTargetColumnId(column.getId());
        moveDto.setNewPosition(2); // Move card1 to the end

        mockMvc.perform(put("/cards/" + card1.getId() + "/move")
                        .header("Authorization", userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(moveDto)))
                .andExpect(status().isNoContent());

        List<Card> cards = cardRepository.findByColumnIdOrderByPositionAsc(column.getId());
        assertEquals(card2.getId(), cards.get(0).getId());
        assertEquals(card3.getId(), cards.get(1).getId());
        assertEquals(card1.getId(), cards.get(2).getId());
    }

    @Test
    void moveCard_toDifferentColumn() throws Exception {
        BoardColumn col1 = columnRepository.save(BoardColumn.builder().name("Col 1").board(board).position(0).build());
        BoardColumn col2 = columnRepository.save(BoardColumn.builder().name("Col 2").board(board).position(1).build());
        
        Card card1 = cardRepository.save(Card.builder().title("Card 1").column(col1).position(0).build());
        Card card2 = cardRepository.save(Card.builder().title("Card 2").column(col1).position(1).build());
        Card card3 = cardRepository.save(Card.builder().title("Card 3").column(col2).position(0).build());

        CardMoveDto moveDto = new CardMoveDto();
        moveDto.setTargetColumnId(col2.getId());
        moveDto.setNewPosition(0); // Move card2 to the beginning of col2

        mockMvc.perform(put("/cards/" + card2.getId() + "/move")
                        .header("Authorization", userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(moveDto)))
                .andExpect(status().isNoContent());

        List<Card> col1Cards = cardRepository.findByColumnIdOrderByPositionAsc(col1.getId());
        assertEquals(1, col1Cards.size());
        assertEquals(card1.getId(), col1Cards.get(0).getId());

        List<Card> col2Cards = cardRepository.findByColumnIdOrderByPositionAsc(col2.getId());
        assertEquals(2, col2Cards.size());
        assertEquals(card2.getId(), col2Cards.get(0).getId());
        assertEquals(card3.getId(), col2Cards.get(1).getId());
    }
}
