package com.taskflow.kanban.board.entity;

import com.taskflow.kanban.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "labels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Label extends AuditableEntity {

    @Column(nullable = false)
    private String name;

    private String color;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id", nullable = false)
    private Board board;
}
