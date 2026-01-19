package com.dsaplatform.controller;

import com.dsaplatform.dto.response.ApiResponse;
import com.dsaplatform.dto.response.LessonContentResponse;
import com.dsaplatform.service.LessonContentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for lesson content generation and retrieval.
 */
@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor
@Slf4j
public class LessonContentController {

    private final LessonContentService lessonContentService;

    /**
     * Get lesson content. Returns cached content if available, otherwise generates new content.
     * 
     * @param lessonId The lesson identifier
     * @param lessonTitle The lesson title (query param)
     * @param topic The topic/subject (query param)
     * @return LessonContentResponse with markdown content
     */
    @GetMapping("/{lessonId}/content")
    public ResponseEntity<ApiResponse<LessonContentResponse>> getLessonContent(
            @PathVariable String lessonId,
            @RequestParam String lessonTitle,
            @RequestParam String topic) {
        
        log.info("📚 Request for lesson content: {} ({})", lessonTitle, lessonId);
        
        LessonContentResponse response = lessonContentService.getLessonContent(
                lessonId, lessonTitle, topic);
        
        String message = response.isCached() 
                ? "Content retrieved from cache" 
                : "Content generated successfully";
        
        return ResponseEntity.ok(ApiResponse.success(response, message));
    }
    
    /**
     * Delete cached content for a lesson (admin operation).
     * 
     * @param lessonId The lesson identifier
     * @return Success response
     */
    @DeleteMapping("/{lessonId}/content")
    public ResponseEntity<ApiResponse<Void>> deleteCachedContent(@PathVariable String lessonId) {
        log.info("🗑️ Request to delete cached content for lesson: {}", lessonId);
        
        lessonContentService.deleteCachedContent(lessonId);
        
        return ResponseEntity.ok(ApiResponse.success(null, "Cached content deleted successfully"));
    }
    
    /**
     * Check if content exists in cache.
     * 
     * @param lessonId The lesson identifier
     * @return Boolean indicating if content exists
     */
    @GetMapping("/{lessonId}/content/exists")
    public ResponseEntity<ApiResponse<Boolean>> checkContentExists(@PathVariable String lessonId) {
        boolean exists = lessonContentService.hasContent(lessonId);
        return ResponseEntity.ok(ApiResponse.success(exists));
    }
}
