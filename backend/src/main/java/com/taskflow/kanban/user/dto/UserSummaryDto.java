package com.taskflow.kanban.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder

public class UserSummaryDto {

    private UUID id;
    private String username;
    private String email;
    private boolean active;
}
