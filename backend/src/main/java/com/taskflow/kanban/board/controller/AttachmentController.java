package com.taskflow.kanban.board.controller;

import com.taskflow.kanban.board.dto.AttachmentDto;
import com.taskflow.kanban.board.service.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/attachments")
@RequiredArgsConstructor
public class AttachmentController {

    private final AttachmentService attachmentService;

    // This is a simplified endpoint. A real implementation would handle file storage.
    @PostMapping("/cards/{cardId}")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("isAuthenticated()")
    public AttachmentDto createAttachment(@PathVariable UUID cardId, @RequestBody AttachmentDto createDto) {
        return attachmentService.createAttachment(
            cardId, 
            createDto.getFileName(), 
            createDto.getFileUrl(), 
            createDto.getFileSize(), 
            createDto.getMimeType()
        );
    }

    @GetMapping("/cards/{cardId}")
    @PreAuthorize("isAuthenticated()")
    public List<AttachmentDto> getAttachmentsByCard(@PathVariable UUID cardId) {
        return attachmentService.getAttachmentsByCard(cardId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("isAuthenticated()")
    public void deleteAttachment(@PathVariable UUID id) {
        attachmentService.deleteAttachment(id);
    }
}
