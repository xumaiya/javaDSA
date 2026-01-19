package com.dsaplatform.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for lesson content.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonContentResponse {
    
    private String lessonId;
    private String lessonTitle;
    private String topic;
    private String content;  // Markdown content
    private LocalDateTime generatedAt;
    private boolean cached;  // true if from cache, false if freshly generated
}
