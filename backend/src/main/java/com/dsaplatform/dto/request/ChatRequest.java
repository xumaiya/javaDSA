package com.dsaplatform.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public class ChatRequest {

    @NotBlank(message = "Message cannot be empty")
    @Size(max = 2000, message = "Message exceeds maximum length of 2000 characters")
    private String message;

    private Long lessonId;
    
    private List<ConversationMessage> conversationHistory;

    public ChatRequest() {}

    public ChatRequest(String message, Long lessonId, List<ConversationMessage> conversationHistory) {
        this.message = message;
        this.lessonId = lessonId;
        this.conversationHistory = conversationHistory;
    }

    public String getMessage() { return message; }
    public Long getLessonId() { return lessonId; }
    public List<ConversationMessage> getConversationHistory() { return conversationHistory; }

    public void setMessage(String message) { this.message = message; }
    public void setLessonId(Long lessonId) { this.lessonId = lessonId; }
    public void setConversationHistory(List<ConversationMessage> conversationHistory) { this.conversationHistory = conversationHistory; }

    public static ChatRequestBuilder builder() { return new ChatRequestBuilder(); }

    public static class ChatRequestBuilder {
        private String message;
        private Long lessonId;
        private List<ConversationMessage> conversationHistory;

        public ChatRequestBuilder message(String message) { this.message = message; return this; }
        public ChatRequestBuilder lessonId(Long lessonId) { this.lessonId = lessonId; return this; }
        public ChatRequestBuilder conversationHistory(List<ConversationMessage> conversationHistory) { this.conversationHistory = conversationHistory; return this; }

        public ChatRequest build() { return new ChatRequest(message, lessonId, conversationHistory); }
    }

    public static class ConversationMessage {
        private String role;
        private String content;

        public ConversationMessage() {}
        public ConversationMessage(String role, String content) {
            this.role = role;
            this.content = content;
        }

        public String getRole() { return role; }
        public String getContent() { return content; }
        public void setRole(String role) { this.role = role; }
        public void setContent(String content) { this.content = content; }
    }
}
