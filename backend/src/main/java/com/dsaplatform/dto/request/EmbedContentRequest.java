package com.dsaplatform.dto.request;

import jakarta.validation.constraints.NotNull;

public class EmbedContentRequest {

    @NotNull(message = "Lesson ID is required")
    private Long lessonId;

    private Integer chunkSize = 500;
    private Integer chunkOverlap = 50;

    public EmbedContentRequest() {}

    public EmbedContentRequest(Long lessonId, Integer chunkSize, Integer chunkOverlap) {
        this.lessonId = lessonId;
        this.chunkSize = chunkSize != null ? chunkSize : 500;
        this.chunkOverlap = chunkOverlap != null ? chunkOverlap : 50;
    }

    public Long getLessonId() { return lessonId; }
    public Integer getChunkSize() { return chunkSize; }
    public Integer getChunkOverlap() { return chunkOverlap; }

    public void setLessonId(Long lessonId) { this.lessonId = lessonId; }
    public void setChunkSize(Integer chunkSize) { this.chunkSize = chunkSize; }
    public void setChunkOverlap(Integer chunkOverlap) { this.chunkOverlap = chunkOverlap; }

    public static EmbedContentRequestBuilder builder() { return new EmbedContentRequestBuilder(); }

    public static class EmbedContentRequestBuilder {
        private Long lessonId;
        private Integer chunkSize = 500;
        private Integer chunkOverlap = 50;

        public EmbedContentRequestBuilder lessonId(Long lessonId) { this.lessonId = lessonId; return this; }
        public EmbedContentRequestBuilder chunkSize(Integer chunkSize) { this.chunkSize = chunkSize; return this; }
        public EmbedContentRequestBuilder chunkOverlap(Integer chunkOverlap) { this.chunkOverlap = chunkOverlap; return this; }

        public EmbedContentRequest build() {
            return new EmbedContentRequest(lessonId, chunkSize, chunkOverlap);
        }
    }
}
