package com.taskflow.kanban.board.entity;

import com.taskflow.kanban.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "attachments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attachment extends AuditableEntity {

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String fileUrl;

    private long fileSize;

    private String mimeType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_id", nullable = false)
    private Card card;
}
