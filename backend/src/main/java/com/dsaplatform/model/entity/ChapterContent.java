package com.dsaplatform.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing dynamically generated content for a chapter.
 * Stores LLM-generated lesson content that is persisted after first generation.
 */
@Entity
@Table(name = "chapter_contents", indexes = {
    @Index(name = "idx_chapter_name", columnList = "chapter_name", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class ChapterContent {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "chapter_name", nullable = false, unique = true, length = 200)
    private String chapterName;
    
    @Column(name = "chapter_title", nullable = false, length = 200)
    private String chapterTitle;
    
    @Column(name = "chapter_description", columnDefinition = "TEXT")
    private String chapterDescription;
    
    @OneToMany(mappedBy = "chapterContent", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("lessonOrder ASC")
    @Builder.Default
    private List<LessonContent> lessons = new ArrayList<>();
    
    @Column(name = "generated_at", nullable = false)
    private LocalDateTime generatedAt;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    /**
     * Helper method to add a lesson to this chapter content.
     */
    public void addLesson(LessonContent lesson) {
        lessons.add(lesson);
        lesson.setChapterContent(this);
    }
    
    /**
     * Helper method to remove a lesson from this chapter content.
     */
    public void removeLesson(LessonContent lesson) {
        lessons.remove(lesson);
        lesson.setChapterContent(null);
    }
}
