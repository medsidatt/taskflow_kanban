package com.taskflow.kanban.board.entity;

import com.taskflow.kanban.entity.AuditableEntity;
import com.taskflow.kanban.workspace.entity.Workspace;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "boards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Board extends AuditableEntity {

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "background_color")
    private String backgroundColor;

    private boolean archived = false;

    private boolean isPrivate = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id")
    private Workspace workspace;

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<BoardMember> members = new HashSet<>();

    private int position;

    // Post-construct to ensure members is never null
    @PostLoad
    private void ensureMembersInitialized() {
        if (this.members == null) {
            this.members = new HashSet<>();
        }
    }
}
