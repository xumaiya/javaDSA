package com.dsaplatform.dto.response;

import java.time.LocalDateTime;

public class EmbedResponse {
    private Long lessonId;
    private Integer chunksCreated;
    private String status;
    private LocalDateTime timestamp;

    public EmbedResponse() {}

    public EmbedResponse(Long lessonId, Integer chunksCreated, String status, LocalDateTime timestamp) {
        this.lessonId = lessonId;
        this.chunksCreated = chunksCreated;
        this.status = status;
        this.timestamp = timestamp;
    }

    public Long getLessonId() { return lessonId; }
    public Integer getChunksCreated() { return chunksCreated; }
    public String getStatus() { return status; }
    public LocalDateTime getTimestamp() { return timestamp; }

    public void setLessonId(Long lessonId) { this.lessonId = lessonId; }
    public void setChunksCreated(Integer chunksCreated) { this.chunksCreated = chunksCreated; }
    public void setStatus(String status) { this.status = status; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public static EmbedResponseBuilder builder() { return new EmbedResponseBuilder(); }

    public static class EmbedResponseBuilder {
        private Long lessonId;
        private Integer chunksCreated;
        private String status;
        private LocalDateTime timestamp;

        public EmbedResponseBuilder lessonId(Long lessonId) { this.lessonId = lessonId; return this; }
        public EmbedResponseBuilder chunksCreated(Integer chunksCreated) { this.chunksCreated = chunksCreated; return this; }
        public EmbedResponseBuilder status(String status) { this.status = status; return this; }
        public EmbedResponseBuilder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }

        public EmbedResponse build() {
            return new EmbedResponse(lessonId, chunksCreated, status, timestamp);
        }
    }
}
