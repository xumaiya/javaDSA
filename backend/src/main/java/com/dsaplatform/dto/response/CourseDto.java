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
public class CourseDto {
    private Long id;
    private String title;
    private String description;
    private String thumbnail;
    private String difficulty;
    private Integer duration;
    private Integer progress; // Calculated field
    private LocalDateTime enrolledAt; // If user is enrolled
    private List<ChapterDto> chapters;
    private LocalDateTime createdAt;
}







