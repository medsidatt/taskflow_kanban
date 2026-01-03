package com.taskflow.kanban.board.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttachmentDto {
    private UUID id;
    private String fileName;
    private String fileUrl;
    private long fileSize;
    private String mimeType;
    private UUID cardId;
}
