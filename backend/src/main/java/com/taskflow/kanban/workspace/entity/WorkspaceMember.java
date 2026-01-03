package com.taskflow.kanban.workspace.entity;

import com.taskflow.kanban.user.entity.User;
import com.taskflow.kanban.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "workspace_members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkspaceMember extends AuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WorkspaceRole role;
}
