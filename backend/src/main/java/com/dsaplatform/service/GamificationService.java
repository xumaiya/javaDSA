package com.dsaplatform.service;

import com.dsaplatform.model.entity.*;
import com.dsaplatform.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class GamificationService {
    
    private final UserRepository userRepository;
    private final BadgeRepository badgeRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final LessonProgressRepository lessonProgressRepository;
    
    // In-memory leaderboard storage
    private static final Map<Long, Integer> leaderboardCache = new ConcurrentHashMap<>();
    
    @Value("${gamification.points.lesson-complete:10}")
    private int pointsLessonComplete;
    
    @Value("${gamification.points.chapter-complete:50}")
    private int pointsChapterComplete;
    
    @Value("${gamification.points.course-complete:200}")
    private int pointsCourseComplete;
    
    @Value("${gamification.streak.bonus-multiplier:1.5}")
    private double streakBonusMultiplier;
    
    @Transactional
    public void onLessonCompleted(Long userId, Long lessonId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Award points
        int pointsEarned = calculatePointsWithStreak(user);
        user.setPoints(user.getPoints() + pointsEarned);
        
        // Update streak
        updateStreak(user);
        
        // Update level
        updateLevel(user);
        
        user = userRepository.save(user);
        
        // Update in-memory leaderboard
        updateLeaderboard(userId, user.getPoints());
        
        // Check for badge achievements
        checkAndAwardBadges(user);
        
        log.info("User {} completed lesson {} and earned {} points", userId, lessonId, pointsEarned);
    }
    
    @Transactional
    public void onChapterCompleted(Long userId, Long chapterId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        int pointsEarned = (int) (pointsChapterComplete * (user.getStreak() > 0 ? streakBonusMultiplier : 1.0));
        user.setPoints(user.getPoints() + pointsEarned);
        user = userRepository.save(user);
        
        updateLeaderboard(userId, user.getPoints());
        checkAndAwardBadges(user);
        
        log.info("User {} completed chapter {} and earned {} points", userId, chapterId, pointsEarned);
    }
    
    @Transactional
    public void onCourseCompleted(Long userId, Long courseId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        int pointsEarned = (int) (pointsCourseComplete * (user.getStreak() > 0 ? streakBonusMultiplier : 1.0));
        user.setPoints(user.getPoints() + pointsEarned);
        user = userRepository.save(user);
        
        updateLeaderboard(userId, user.getPoints());
        checkAndAwardBadges(user);
        
        log.info("User {} completed course {} and earned {} points", userId, courseId, pointsEarned);
    }
    
    private int calculatePointsWithStreak(User user) {
        double multiplier = user.getStreak() > 0 ? streakBonusMultiplier : 1.0;
        return (int) (pointsLessonComplete * multiplier);
    }
    
    private void updateStreak(User user) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lastActivity = user.getLastActivityDate();
        
        if (lastActivity == null) {
            user.setStreak(1);
        } else {
            LocalDateTime yesterday = now.minusDays(1);
            if (lastActivity.toLocalDate().equals(now.toLocalDate())) {
                // Already active today, no change
            } else if (lastActivity.toLocalDate().equals(yesterday.toLocalDate())) {
                // Consecutive day
                user.setStreak(user.getStreak() + 1);
            } else {
                // Streak broken
                user.setStreak(1);
            }
        }
        
        user.setLastActivityDate(now);
    }
    
    private void updateLevel(User user) {
        // Simple level calculation: level = sqrt(points / 100) + 1
        int newLevel = (int) Math.sqrt(user.getPoints() / 100.0) + 1;
        if (newLevel > user.getLevel()) {
            user.setLevel(newLevel);
            log.info("User {} leveled up to level {}", user.getId(), newLevel);
        }
    }
    
    private void updateLeaderboard(Long userId, Integer points) {
        leaderboardCache.put(userId, points);
    }
    
    /**
     * Get leaderboard cache for LeaderboardService.
     */
    public static Map<Long, Integer> getLeaderboardCache() {
        return leaderboardCache;
    }
    
    private void checkAndAwardBadges(User user) {
        List<Badge> allBadges = badgeRepository.findAll();
        
        for (Badge badge : allBadges) {
            if (!userBadgeRepository.existsByUserIdAndBadgeId(user.getId(), badge.getId())) {
                if (shouldAwardBadge(user, badge)) {
                    awardBadge(user, badge);
                }
            }
        }
    }
    
    private boolean shouldAwardBadge(User user, Badge badge) {
        String badgeName = badge.getName().toLowerCase();
        
        if (badgeName.contains("first") && badgeName.contains("step")) {
            return lessonProgressRepository.countCompletedLessonsByUserId(user.getId()) >= 1;
        } else if (badgeName.contains("week") && badgeName.contains("warrior")) {
            return user.getStreak() >= 7;
        } else if (badgeName.contains("chapter") && badgeName.contains("master")) {
            return true; // Simplified
        } else if (badgeName.contains("algorithm") && badgeName.contains("guru")) {
            return user.getPoints() >= 1000;
        }
        
        return false;
    }
    
    @Transactional
    private void awardBadge(User user, Badge badge) {
        UserBadge userBadge = UserBadge.builder()
                .user(user)
                .badge(badge)
                .build();
        userBadgeRepository.save(userBadge);
        log.info("User {} earned badge: {}", user.getId(), badge.getName());
    }
}
