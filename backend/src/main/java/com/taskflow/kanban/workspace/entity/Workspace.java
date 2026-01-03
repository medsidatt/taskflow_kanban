package com.taskflow.kanban.workspace.entity;

import com.taskflow.kanban.board.entity.Board;
import com.taskflow.kanban.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "workspaces")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Workspace extends AuditableEntity {

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "is_private", nullable = false)
    private boolean isPrivate = false;

    @OneToMany(mappedBy = "workspace", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<WorkspaceMember> members = new HashSet<>();

    @OneToMany(mappedBy = "workspace", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Board> boards = new HashSet<>();

    // Post-construct to ensure members and boards are never null
    @PostLoad
    private void ensureCollectionsInitialized() {
        if (this.members == null) {
            this.members = new HashSet<>();
        }
        if (this.boards == null) {
            this.boards = new HashSet<>();
        }
    }
}
