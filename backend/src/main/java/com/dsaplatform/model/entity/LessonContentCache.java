package com.dsaplatform.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity for caching AI-generated lesson content.
 * Stores markdown content for lessons to avoid regenerating.
 */
@Entity
@Table(name = "lesson_content_cache")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonContentCache {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String lessonId;
    
    @Column(nullable = false)
    private String lessonTitle;
    
    @Column(nullable = false)
    private String topic;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;  // Markdown content
    
    @Column(nullable = false)
    private LocalDateTime generatedAt;
    
    @Column
    private Integer contentLength;
}
