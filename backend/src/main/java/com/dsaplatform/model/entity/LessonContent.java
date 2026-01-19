package com.dsaplatform.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Entity representing a single lesson's content within a chapter.
 * Stores LLM-generated lesson explanations in markdown/text format.
 */
@Entity
@Table(name = "lesson_contents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class LessonContent {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chapter_content_id", nullable = false)
    private ChapterContent chapterContent;
    
    @Column(name = "lesson_title", nullable = false, length = 300)
    private String lessonTitle;
    
    @Lob
    @Column(name = "lesson_explanation", nullable = false, columnDefinition = "TEXT")
    private String lessonExplanation;
    
    @Column(name = "lesson_order", nullable = false)
    private Integer lessonOrder;
    
    @Column(name = "estimated_duration")
    private Integer estimatedDuration; // in minutes
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
