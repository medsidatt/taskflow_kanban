package com.taskflow.kanban.board.service.impl;

import com.taskflow.kanban.board.dto.AttachmentDto;
import com.taskflow.kanban.board.entity.Attachment;
import com.taskflow.kanban.board.entity.Card;
import com.taskflow.kanban.board.repository.AttachmentRepository;
import com.taskflow.kanban.board.repository.CardRepository;
import com.taskflow.kanban.board.service.AttachmentService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AttachmentServiceImpl implements AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final CardRepository cardRepository;

    @Override
    public AttachmentDto createAttachment(UUID cardId, String fileName, String fileUrl, long fileSize, String mimeType) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new EntityNotFoundException("Card not found"));

        Attachment attachment = Attachment.builder()
                .card(card)
                .fileName(fileName)
                .fileUrl(fileUrl)
                .fileSize(fileSize)
                .mimeType(mimeType)
                .build();

        return toDto(attachmentRepository.save(attachment));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttachmentDto> getAttachmentsByCard(UUID cardId) {
        return attachmentRepository.findByCardId(cardId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteAttachment(UUID id) {
        if (!attachmentRepository.existsById(id)) {
            throw new EntityNotFoundException("Attachment not found");
        }
        attachmentRepository.deleteById(id);
    }

    private AttachmentDto toDto(Attachment attachment) {
        return AttachmentDto.builder()
                .id(attachment.getId())
                .fileName(attachment.getFileName())
                .fileUrl(attachment.getFileUrl())
                .fileSize(attachment.getFileSize())
                .mimeType(attachment.getMimeType())
                .cardId(attachment.getCard().getId())
                .build();
    }
}
