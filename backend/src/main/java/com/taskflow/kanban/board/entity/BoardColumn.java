package com.taskflow.kanban.board.entity;

import com.taskflow.kanban.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "board_columns")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardColumn extends AuditableEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int position;

    private Integer wipLimit;

    private boolean archived = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id", nullable = false)
    private Board board;

    @OneToMany(mappedBy = "column", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Card> cards = new HashSet<>();

    // Post-construct to ensure cards is never null
    @PostLoad
    private void ensureCardsInitialized() {
        if (this.cards == null) {
            this.cards = new HashSet<>();
        }
    }
}
