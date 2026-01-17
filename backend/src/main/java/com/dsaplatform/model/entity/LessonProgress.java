package com.dsaplatform.model.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "lesson_progress", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "lesson_id"})
})
@EntityListeners(AuditingEntityListener.class)
public class LessonProgress {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;
    
    @Column(nullable = false)
    private Boolean completed = false;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public LessonProgress() {}
    
    public LessonProgress(Long id, User user, Lesson lesson, Boolean completed,
                          LocalDateTime completedAt, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.user = user;
        this.lesson = lesson;
        this.completed = completed != null ? completed : false;
        this.completedAt = completedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    public Long getId() { return id; }
    public User getUser() { return user; }
    public Lesson getLesson() { return lesson; }
    public Boolean getCompleted() { return completed; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    
    public void setId(Long id) { this.id = id; }
    public void setUser(User user) { this.user = user; }
    public void setLesson(Lesson lesson) { this.lesson = lesson; }
    public void setCompleted(Boolean completed) { this.completed = completed; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public static LessonProgressBuilder builder() { return new LessonProgressBuilder(); }
    
    public static class LessonProgressBuilder {
        private Long id;
        private User user;
        private Lesson lesson;
        private Boolean completed = false;
        private LocalDateTime completedAt;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        
        public LessonProgressBuilder id(Long id) { this.id = id; return this; }
        public LessonProgressBuilder user(User user) { this.user = user; return this; }
        public LessonProgressBuilder lesson(Lesson lesson) { this.lesson = lesson; return this; }
        public LessonProgressBuilder completed(Boolean completed) { this.completed = completed; return this; }
        public LessonProgressBuilder completedAt(LocalDateTime completedAt) { this.completedAt = completedAt; return this; }
        public LessonProgressBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public LessonProgressBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        
        public LessonProgress build() {
            return new LessonProgress(id, user, lesson, completed, completedAt, createdAt, updatedAt);
        }
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LessonProgress that = (LessonProgress) o;
        return Objects.equals(id, that.id);
    }
    
    @Override
    public int hashCode() { return Objects.hash(id); }
}
