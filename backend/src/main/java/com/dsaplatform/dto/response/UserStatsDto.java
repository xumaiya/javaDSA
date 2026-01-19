package com.dsaplatform.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for user statistics displayed on dashboard.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsDto {
    private Integer points;
    private Integer streak;
    private Integer level;
    private Integer completedLessonsCount;
    private Integer enrolledCoursesCount;
    private Double averageProgress;
    private List<Integer> weeklyActivity; // Activity for last 7 days (Mon-Sun)
    private Integer pointsThisWeek;
}
