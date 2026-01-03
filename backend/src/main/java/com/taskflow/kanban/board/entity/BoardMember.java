package com.taskflow.kanban.board.entity;

import com.taskflow.kanban.user.entity.User;
import com.taskflow.kanban.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "board_members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardMember extends AuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id", nullable = false)
    private Board board;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BoardRole role;
}
