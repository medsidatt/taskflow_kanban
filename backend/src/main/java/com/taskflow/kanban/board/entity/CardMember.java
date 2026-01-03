package com.taskflow.kanban.board.entity;

import com.taskflow.kanban.user.entity.User;
import com.taskflow.kanban.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "card_members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CardMember extends AuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_id", nullable = false)
    private Card card;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CardRole role;
}
