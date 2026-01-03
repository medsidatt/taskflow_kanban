package com.taskflow.kanban.user.dto;

import lombok.Data;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

/**
 * Optional fields: only provided fields are updated. Null/blank are ignored.
 * Validation runs only on non-null values.
 */
@Data
public class UserProfileUpdateDto {
    @Size(min = 1, max = 50, message = "Username must be 1–50 characters")
    private String username;

    @Email(message = "Enter a valid email address")
    @Size(max = 100)
    private String email;
}
