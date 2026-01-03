package com.taskflow.kanban.board.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "activity_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String entityType;

    @Column(nullable = false)
    private UUID entityId;

    @Column(nullable = false)
    private String action; // e.g., CREATED, UPDATED, MOVED, DELETED

    @Column(columnDefinition = "TEXT")
    private String details; // e.g., "User moved card from 'To Do' to 'In Progress'"

    @Column(nullable = false)
    private Instant timestamp;

    @Column(nullable = false)
    private UUID performedBy;
}
