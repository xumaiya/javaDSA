package com.dsaplatform.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChatMessageRequest {
    @NotBlank(message = "Message is required")
    private String message;
    private String conversationId; // Optional for conversation continuity
}







