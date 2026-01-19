package com.dsaplatform.controller;

import com.dsaplatform.dto.request.QuizGenerationRequest;
import com.dsaplatform.dto.response.ApiResponse;
import com.dsaplatform.dto.response.QuizResponse;
import com.dsaplatform.service.QuizGenerationService;
import com.dsaplatform.util.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for dynamic quiz generation using LLM.
 * Generates quiz questions based on DSA topics and difficulty levels.
 */
@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
@Slf4j
public class QuizController {

    private final QuizGenerationService quizGenerationService;
    private final SecurityUtil securityUtil;

    /**
     * Generate quiz questions dynamically using AI based on topic and difficulty.
     * 
     * @param request The quiz generation request containing topic, difficulty, and question count
     * @param authentication The current user's authentication
     * @return QuizResponse with generated questions
     */
    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<QuizResponse>> generateQuiz(
            @Valid @RequestBody QuizGenerationRequest request,
            Authentication authentication) {
        
        Long userId = securityUtil.getUserId(authentication);
        log.info("Generating quiz for user {} - Topic: {}, Difficulty: {}, Questions: {}", 
                userId, request.getTopic(), request.getDifficulty(), request.getQuestionCount());
        
        QuizResponse response = quizGenerationService.generateQuiz(
                request.getTopic(),
                request.getDifficulty(),
                request.getQuestionCount()
        );
        
        return ResponseEntity.ok(ApiResponse.success(response, 
                "Successfully generated " + response.getQuestions().size() + " quiz questions"));
    }
}
