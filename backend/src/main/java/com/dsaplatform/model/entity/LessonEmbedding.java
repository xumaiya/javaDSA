package com.dsaplatform.model.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "lesson_embeddings")
@EntityListeners(AuditingEntityListener.class)
public class LessonEmbedding {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;
    
    @Column(columnDefinition = "TEXT")
    private String embedding;
    
    @Column(length = 2000)
    private String chunkText;
    
    @Column(name = "chunk_index")
    private Integer chunkIndex;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    public LessonEmbedding() {}
    
    public LessonEmbedding(Long id, Lesson lesson, String embedding, String chunkText,
                           Integer chunkIndex, LocalDateTime createdAt) {
        this.id = id;
        this.lesson = lesson;
        this.embedding = embedding;
        this.chunkText = chunkText;
        this.chunkIndex = chunkIndex;
        this.createdAt = createdAt;
    }
    
    public Long getId() { return id; }
    public Lesson getLesson() { return lesson; }
    public String getEmbedding() { return embedding; }
    public String getChunkText() { return chunkText; }
    public Integer getChunkIndex() { return chunkIndex; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    
    public void setId(Long id) { this.id = id; }
    public void setLesson(Lesson lesson) { this.lesson = lesson; }
    public void setEmbedding(String embedding) { this.embedding = embedding; }
    public void setChunkText(String chunkText) { this.chunkText = chunkText; }
    public void setChunkIndex(Integer chunkIndex) { this.chunkIndex = chunkIndex; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    /**
     * Parse the embedding string to a double array for similarity calculations.
     */
    public double[] getEmbeddingVector() {
        if (embedding == null || embedding.isEmpty()) {
            return new double[0];
        }
        // Remove brackets and split by comma
        String cleaned = embedding.replaceAll("[\\[\\]]", "");
        if (cleaned.isEmpty()) {
            return new double[0];
        }
        String[] parts = cleaned.split(",");
        double[] vector = new double[parts.length];
        for (int i = 0; i < parts.length; i++) {
            vector[i] = Double.parseDouble(parts[i].trim());
        }
        return vector;
    }
    
    public static LessonEmbeddingBuilder builder() { return new LessonEmbeddingBuilder(); }
    
    public static class LessonEmbeddingBuilder {
        private Long id;
        private Lesson lesson;
        private String embedding;
        private String chunkText;
        private Integer chunkIndex;
        private LocalDateTime createdAt;
        
        public LessonEmbeddingBuilder id(Long id) { this.id = id; return this; }
        public LessonEmbeddingBuilder lesson(Lesson lesson) { this.lesson = lesson; return this; }
        public LessonEmbeddingBuilder embedding(String embedding) { this.embedding = embedding; return this; }
        public LessonEmbeddingBuilder chunkText(String chunkText) { this.chunkText = chunkText; return this; }
        public LessonEmbeddingBuilder chunkIndex(Integer chunkIndex) { this.chunkIndex = chunkIndex; return this; }
        public LessonEmbeddingBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        
        public LessonEmbedding build() {
            return new LessonEmbedding(id, lesson, embedding, chunkText, chunkIndex, createdAt);
        }
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LessonEmbedding that = (LessonEmbedding) o;
        return Objects.equals(id, that.id);
    }
    
    @Override
    public int hashCode() { return Objects.hash(id); }
}
