package com.dsaplatform.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonDto {
    private Long id;
    private Long chapterId;
    private String title;
    private String content;
    private Integer order;
    private Integer duration;
    private Boolean completed; // Calculated field
    private Boolean unlocked; // Calculated field
    private LocalDateTime createdAt;
}







