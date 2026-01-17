package com.dsaplatform.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChapterDto {
    private Long id;
    private Long courseId;
    private String title;
    private String description;
    private Integer order;
    private Integer progress; // Calculated field
    private Boolean unlocked; // Calculated field
    private List<LessonDto> lessons;
    private LocalDateTime createdAt;
}







