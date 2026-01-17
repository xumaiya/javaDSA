package com.dsaplatform.model.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "chat_logs")
@EntityListeners(AuditingEntityListener.class)
public class ChatLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "user_question", nullable = false, columnDefinition = "TEXT")
    private String userQuestion;

    @Column(name = "bot_response", columnDefinition = "TEXT")
    private String botResponse;

    @Column(name = "confidence_score", precision = 5, scale = 4)
    private BigDecimal confidenceScore;

    @Column(name = "retrieved_chunks")
    private Integer retrievedChunks;

    @Column(name = "related_chapter_ids", columnDefinition = "TEXT")
    private String relatedChapterIds;

    @Column(name = "question_timestamp", nullable = false)
    private LocalDateTime questionTimestamp;

    @Column(name = "response_timestamp")
    private LocalDateTime responseTimestamp;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public ChatLog() {}

    public ChatLog(Long id, Long userId, String userQuestion, String botResponse,
                   BigDecimal confidenceScore, Integer retrievedChunks, String relatedChapterIds,
                   LocalDateTime questionTimestamp, LocalDateTime responseTimestamp, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.userQuestion = userQuestion;
        this.botResponse = botResponse;
        this.confidenceScore = confidenceScore;
        this.retrievedChunks = retrievedChunks;
        this.relatedChapterIds = relatedChapterIds;
        this.questionTimestamp = questionTimestamp;
        this.responseTimestamp = responseTimestamp;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getUserQuestion() { return userQuestion; }
    public String getBotResponse() { return botResponse; }
    public BigDecimal getConfidenceScore() { return confidenceScore; }
    public Integer getRetrievedChunks() { return retrievedChunks; }
    public String getRelatedChapterIds() { return relatedChapterIds; }
    public LocalDateTime getQuestionTimestamp() { return questionTimestamp; }
    public LocalDateTime getResponseTimestamp() { return responseTimestamp; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setUserQuestion(String userQuestion) { this.userQuestion = userQuestion; }
    public void setBotResponse(String botResponse) { this.botResponse = botResponse; }
    public void setConfidenceScore(BigDecimal confidenceScore) { this.confidenceScore = confidenceScore; }
    public void setRetrievedChunks(Integer retrievedChunks) { this.retrievedChunks = retrievedChunks; }
    public void setRelatedChapterIds(String relatedChapterIds) { this.relatedChapterIds = relatedChapterIds; }
    public void setQuestionTimestamp(LocalDateTime questionTimestamp) { this.questionTimestamp = questionTimestamp; }
    public void setResponseTimestamp(LocalDateTime responseTimestamp) { this.responseTimestamp = responseTimestamp; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static ChatLogBuilder builder() { return new ChatLogBuilder(); }

    public static class ChatLogBuilder {
        private Long id;
        private Long userId;
        private String userQuestion;
        private String botResponse;
        private BigDecimal confidenceScore;
        private Integer retrievedChunks;
        private String relatedChapterIds;
        private LocalDateTime questionTimestamp;
        private LocalDateTime responseTimestamp;
        private LocalDateTime createdAt;

        public ChatLogBuilder id(Long id) { this.id = id; return this; }
        public ChatLogBuilder userId(Long userId) { this.userId = userId; return this; }
        public ChatLogBuilder userQuestion(String userQuestion) { this.userQuestion = userQuestion; return this; }
        public ChatLogBuilder botResponse(String botResponse) { this.botResponse = botResponse; return this; }
        public ChatLogBuilder confidenceScore(BigDecimal confidenceScore) { this.confidenceScore = confidenceScore; return this; }
        public ChatLogBuilder retrievedChunks(Integer retrievedChunks) { this.retrievedChunks = retrievedChunks; return this; }
        public ChatLogBuilder relatedChapterIds(String relatedChapterIds) { this.relatedChapterIds = relatedChapterIds; return this; }
        public ChatLogBuilder questionTimestamp(LocalDateTime questionTimestamp) { this.questionTimestamp = questionTimestamp; return this; }
        public ChatLogBuilder responseTimestamp(LocalDateTime responseTimestamp) { this.responseTimestamp = responseTimestamp; return this; }
        public ChatLogBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ChatLog build() {
            return new ChatLog(id, userId, userQuestion, botResponse, confidenceScore, retrievedChunks,
                              relatedChapterIds, questionTimestamp, responseTimestamp, createdAt);
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ChatLog chatLog = (ChatLog) o;
        return Objects.equals(id, chatLog.id);
    }

    @Override
    public int hashCode() { return Objects.hash(id); }
}
