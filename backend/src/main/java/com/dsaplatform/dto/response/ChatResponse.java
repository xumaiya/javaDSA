package com.dsaplatform.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class ChatResponse {
    private String id;
    private String content;
    private Double confidenceScore;
    private List<ChapterReference> relatedChapters;
    private LocalDateTime timestamp;

    public ChatResponse() {}

    public ChatResponse(String id, String content, Double confidenceScore,
                        List<ChapterReference> relatedChapters, LocalDateTime timestamp) {
        this.id = id;
        this.content = content;
        this.confidenceScore = confidenceScore;
        this.relatedChapters = relatedChapters;
        this.timestamp = timestamp;
    }

    public String getId() { return id; }
    public String getContent() { return content; }
    public Double getConfidenceScore() { return confidenceScore; }
    public List<ChapterReference> getRelatedChapters() { return relatedChapters; }
    public LocalDateTime getTimestamp() { return timestamp; }

    public void setId(String id) { this.id = id; }
    public void setContent(String content) { this.content = content; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }
    public void setRelatedChapters(List<ChapterReference> relatedChapters) { this.relatedChapters = relatedChapters; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public static ChatResponseBuilder builder() { return new ChatResponseBuilder(); }

    public static class ChatResponseBuilder {
        private String id;
        private String content;
        private Double confidenceScore;
        private List<ChapterReference> relatedChapters;
        private LocalDateTime timestamp;

        public ChatResponseBuilder id(String id) { this.id = id; return this; }
        public ChatResponseBuilder content(String content) { this.content = content; return this; }
        public ChatResponseBuilder confidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; return this; }
        public ChatResponseBuilder relatedChapters(List<ChapterReference> relatedChapters) { this.relatedChapters = relatedChapters; return this; }
        public ChatResponseBuilder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }

        public ChatResponse build() {
            return new ChatResponse(id, content, confidenceScore, relatedChapters, timestamp);
        }
    }

    public static class ChapterReference {
        private Long chapterId;
        private String chapterTitle;
        private Double relevanceScore;

        public ChapterReference() {}

        public ChapterReference(Long chapterId, String chapterTitle, Double relevanceScore) {
            this.chapterId = chapterId;
            this.chapterTitle = chapterTitle;
            this.relevanceScore = relevanceScore;
        }

        public Long getChapterId() { return chapterId; }
        public String getChapterTitle() { return chapterTitle; }
        public Double getRelevanceScore() { return relevanceScore; }

        public void setChapterId(Long chapterId) { this.chapterId = chapterId; }
        public void setChapterTitle(String chapterTitle) { this.chapterTitle = chapterTitle; }
        public void setRelevanceScore(Double relevanceScore) { this.relevanceScore = relevanceScore; }

        public static ChapterReferenceBuilder builder() { return new ChapterReferenceBuilder(); }

        public static class ChapterReferenceBuilder {
            private Long chapterId;
            private String chapterTitle;
            private Double relevanceScore;

            public ChapterReferenceBuilder chapterId(Long chapterId) { this.chapterId = chapterId; return this; }
            public ChapterReferenceBuilder chapterTitle(String chapterTitle) { this.chapterTitle = chapterTitle; return this; }
            public ChapterReferenceBuilder relevanceScore(Double relevanceScore) { this.relevanceScore = relevanceScore; return this; }

            public ChapterReference build() {
                return new ChapterReference(chapterId, chapterTitle, relevanceScore);
            }
        }
    }
}
