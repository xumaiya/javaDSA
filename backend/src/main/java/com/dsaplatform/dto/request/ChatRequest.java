package com.dsaplatform.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ChatRequest {

    @NotBlank(message = "Message cannot be empty")
    @Size(max = 2000, message = "Message exceeds maximum length of 2000 characters")
    private String message;

    private Long lessonId;

    public ChatRequest() {}

    public ChatRequest(String message, Long lessonId) {
        this.message = message;
        this.lessonId = lessonId;
    }

    public String getMessage() { return message; }
    public Long getLessonId() { return lessonId; }

    public void setMessage(String message) { this.message = message; }
    public void setLessonId(Long lessonId) { this.lessonId = lessonId; }

    public static ChatRequestBuilder builder() { return new ChatRequestBuilder(); }

    public static class ChatRequestBuilder {
        private String message;
        private Long lessonId;

        public ChatRequestBuilder message(String message) { this.message = message; return this; }
        public ChatRequestBuilder lessonId(Long lessonId) { this.lessonId = lessonId; return this; }

        public ChatRequest build() { return new ChatRequest(message, lessonId); }
    }
}
