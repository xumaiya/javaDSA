package com.dsaplatform.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO for chapter content with lessons.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChapterContentResponse {
    
    private Long id;
    private String chapterName;
    private String chapterTitle;
    private String chapterDescription;
    private List<LessonContentResponse> lessons;
    private LocalDateTime generatedAt;
    private boolean cached; // Indicates if content was retrieved from cache
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LessonContentResponse {
        private Long id;
        private String lessonTitle;
        private String lessonExplanation;
        private Integer lessonOrder;
        private Integer estimatedDuration;
    }
}
