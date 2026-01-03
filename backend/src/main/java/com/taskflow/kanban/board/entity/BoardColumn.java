package com.taskflow.kanban.board.entity;

import com.taskflow.kanban.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

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
}
