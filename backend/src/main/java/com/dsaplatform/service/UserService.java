package com.dsaplatform.service;

import com.dsaplatform.dto.response.BadgeDto;
import com.dsaplatform.dto.response.UserDto;
import com.dsaplatform.dto.response.UserStatsDto;
import com.dsaplatform.mapper.BadgeMapper;
import com.dsaplatform.mapper.UserMapper;
import com.dsaplatform.model.entity.LessonProgress;
import com.dsaplatform.model.entity.User;
import com.dsaplatform.model.entity.UserBadge;
import com.dsaplatform.repository.LessonProgressRepository;
import com.dsaplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final BadgeMapper badgeMapper;
    private final LessonProgressRepository lessonProgressRepository;
    private final CourseEnrollmentService enrollmentService;
    
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toUserDtoWithBadges(user);
    }
    
    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toUserDtoWithBadges(user);
    }
    
    @Transactional
    public UserDto updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (userDto.getUsername() != null) {
            user.setUsername(userDto.getUsername());
        }
        if (userDto.getAvatar() != null) {
            user.setAvatar(userDto.getAvatar());
        }
        
        user = userRepository.save(user);
        return toUserDtoWithBadges(user);
    }
    
    /**
     * Get user statistics for dashboard.
     */
    @Transactional(readOnly = true)
    public UserStatsDto getUserStats(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Get completed lessons
        List<LessonProgress> completedLessons = lessonProgressRepository.findByUserId(userId).stream()
                .filter(LessonProgress::getCompleted)
                .collect(Collectors.toList());
        
        int completedCount = completedLessons.size();
        
        // Calculate weekly activity (last 7 days: Mon-Sun)
        List<Integer> weeklyActivity = calculateWeeklyActivity(completedLessons);
        
        // Calculate points this week
        int pointsThisWeek = calculatePointsThisWeek(completedLessons);
        
        // Get enrolled courses count
        long enrolledCoursesCount = enrollmentService.getEnrolledCoursesCount(userId);
        
        // Calculate average progress (placeholder for now)
        double averageProgress = 0.0;
        
        return UserStatsDto.builder()
                .points(user.getPoints())
                .streak(user.getStreak())
                .level(user.getLevel())
                .completedLessonsCount(completedCount)
                .enrolledCoursesCount((int) enrolledCoursesCount)
                .averageProgress(averageProgress)
                .weeklyActivity(weeklyActivity)
                .pointsThisWeek(pointsThisWeek)
                .build();
    }
    
    /**
     * Calculate activity for the last 7 days (Monday to Sunday).
     * Returns list of 7 integers representing activity percentage for each day.
     */
    private List<Integer> calculateWeeklyActivity(List<LessonProgress> completedLessons) {
        LocalDate today = LocalDate.now();
        LocalDate monday = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        
        List<Integer> activity = new ArrayList<>();
        
        for (int i = 0; i < 7; i++) {
            LocalDate day = monday.plusDays(i);
            long count = completedLessons.stream()
                    .filter(lp -> lp.getCompletedAt() != null)
                    .filter(lp -> lp.getCompletedAt().toLocalDate().equals(day))
                    .count();
            
            // Convert count to percentage (0-100)
            // Assume max 10 lessons per day = 100%
            int percentage = (int) Math.min(100, (count * 10));
            activity.add(percentage);
        }
        
        return activity;
    }
    
    /**
     * Calculate points earned this week.
     */
    private int calculatePointsThisWeek(List<LessonProgress> completedLessons) {
        LocalDate today = LocalDate.now();
        LocalDate monday = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDateTime mondayStart = monday.atStartOfDay();
        
        long lessonsThisWeek = completedLessons.stream()
                .filter(lp -> lp.getCompletedAt() != null)
                .filter(lp -> lp.getCompletedAt().isAfter(mondayStart))
                .count();
        
        // Assume 10 points per lesson
        return (int) (lessonsThisWeek * 10);
    }
    
    private UserDto toUserDtoWithBadges(User user) {
        UserDto dto = userMapper.toDto(user);
        List<BadgeDto> badges = user.getBadges().stream()
                .map(UserBadge::getBadge)
                .map(badge -> {
                    BadgeDto badgeDto = badgeMapper.toDto(badge);
                    badgeDto.setEarnedAt(user.getBadges().stream()
                            .filter(ub -> ub.getBadge().getId().equals(badge.getId()))
                            .findFirst()
                            .map(UserBadge::getEarnedAt)
                            .orElse(null));
                    return badgeDto;
                })
                .collect(Collectors.toList());
        dto.setBadges(badges);
        return dto;
    }
}







