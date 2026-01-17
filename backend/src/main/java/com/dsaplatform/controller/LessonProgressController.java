package com.dsaplatform.controller;

import com.dsaplatform.dto.response.ApiResponse;
import com.dsaplatform.model.entity.LessonProgress;
import com.dsaplatform.repository.LessonProgressRepository;
import com.dsaplatform.repository.LessonRepository;
import com.dsaplatform.repository.UserRepository;
import com.dsaplatform.service.GamificationService;
import com.dsaplatform.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor
public class LessonProgressController {
    
    private final LessonProgressRepository progressRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;
    private final GamificationService gamificationService;
    private final SecurityUtil securityUtil;
    
    @GetMapping("/progress")
    public ResponseEntity<ApiResponse<List<Long>>> getUserProgress(Authentication authentication) {
        Long userId = securityUtil.getUserId(authentication);
        if (userId == null) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error("Unauthorized"));
        }
        
        List<Long> completedLessonIds = progressRepository.findByUserId(userId).stream()
                .filter(LessonProgress::getCompleted)
                .map(lp -> lp.getLesson().getId())
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success(completedLessonIds));
    }
    
    @PostMapping("/{lessonId}/complete")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> completeLesson(
            @PathVariable Long lessonId,
            Authentication authentication) {
        Long userId = securityUtil.getUserId(authentication);
        if (userId == null) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error("Unauthorized"));
        }
        
        LessonProgress progress = progressRepository
                .findByUserIdAndLessonId(userId, lessonId)
                .orElse(LessonProgress.builder()
                        .user(userRepository.findById(userId).orElseThrow())
                        .lesson(lessonRepository.findById(lessonId).orElseThrow())
                        .completed(false)
                        .build());
        
        if (!progress.getCompleted()) {
            progress.setCompleted(true);
            progress.setCompletedAt(java.time.LocalDateTime.now());
            progressRepository.save(progress);
            
            // Trigger gamification
            gamificationService.onLessonCompleted(userId, lessonId);
        }
        
        return ResponseEntity.ok(ApiResponse.success(null, "Lesson marked as complete"));
    }
}

