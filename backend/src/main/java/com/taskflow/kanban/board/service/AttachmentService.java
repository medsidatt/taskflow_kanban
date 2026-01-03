package com.taskflow.kanban.board.service;

import com.taskflow.kanban.board.dto.AttachmentDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface AttachmentService {
    // For a real implementation, we would pass a MultipartFile
    // For now, we'll simulate it with a DTO that contains the URL
    AttachmentDto createAttachment(UUID cardId, String fileName, String fileUrl, long fileSize, String mimeType);
    
    List<AttachmentDto> getAttachmentsByCard(UUID cardId);
    
    void deleteAttachment(UUID id);
}
