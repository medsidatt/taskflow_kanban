package com.taskflow.kanban.board.entity;

import com.taskflow.kanban.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "cards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Card extends AuditableEntity {

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(nullable = false)
    private int position;

    @Builder.Default
    private boolean archived = false;

    @Column(name = "achieved", nullable = false)
    @Builder.Default
    private boolean achieved = false;

    private Instant dueDate;
    private Instant startDate;

    private Integer priority; // 1 = highest

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "column_id", nullable = false)
    private BoardColumn column;

    @OneToMany(mappedBy = "card", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<CardMember> members = new HashSet<>();

    @OneToMany(mappedBy = "card", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Comment> comments = new HashSet<>();

    @OneToMany(mappedBy = "card", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Attachment> attachments = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "card_labels",
            joinColumns = @JoinColumn(name = "card_id"),
            inverseJoinColumns = @JoinColumn(name = "label_id")
    )
    @Builder.Default
    private Set<Label> labels = new HashSet<>();

    // Post-construct to ensure collections are never null
    @PostLoad
    private void ensureCollectionsInitialized() {
        if (this.members == null) {
            this.members = new HashSet<>();
        }
        if (this.comments == null) {
            this.comments = new HashSet<>();
        }
        if (this.attachments == null) {
            this.attachments = new HashSet<>();
        }
        if (this.labels == null) {
            this.labels = new HashSet<>();
        }
    }
}
