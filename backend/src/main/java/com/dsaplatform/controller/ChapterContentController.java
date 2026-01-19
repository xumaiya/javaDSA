package com.dsaplatform.controller;

import com.dsaplatform.dto.response.ApiResponse;
import com.dsaplatform.dto.response.ChapterContentResponse;
import com.dsaplatform.service.ContentGenerationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for dynamic chapter content generation and retrieval.
 * Provides endpoints to fetch LLM-generated lesson content for chapters.
 */
@RestController
@RequestMapping("/api/chapters")
@RequiredArgsConstructor
@Slf4j
public class ChapterContentController {
    
    private final ContentGenerationService contentGenerationService;
    
    /**
     * Get lessons for a chapter. Returns cached content if available,
     * otherwise generates new content using LLM and caches it.
     * 
     * @param chapterName The name of the chapter (e.g., "Stack", "Queue", "Linked List")
     * @return ChapterContentResponse with lessons
     */
    @GetMapping("/{chapterName}/lessons")
    public ResponseEntity<ApiResponse<ChapterContentResponse>> getChapterLessons(
            @PathVariable String chapterName) {
        
        log.info("Received request for chapter lessons: {}", chapterName);
        
        ChapterContentResponse content = contentGenerationService.getOrGenerateChapterContent(chapterName);
        
        String message = content.isCached() 
                ? "Retrieved cached content for chapter: " + chapterName
                : "Generated new content for chapter: " + chapterName;
        
        return ResponseEntity.ok(ApiResponse.success(content, message));
    }
    
    /**
     * Check if content exists for a chapter.
     * 
     * @param chapterName The name of the chapter
     * @return Boolean indicating if content exists
     */
    @GetMapping("/{chapterName}/exists")
    public ResponseEntity<ApiResponse<Boolean>> checkContentExists(
            @PathVariable String chapterName) {
        
        log.debug("Checking if content exists for chapter: {}", chapterName);
        
        boolean exists = contentGenerationService.hasContent(chapterName);
        
        return ResponseEntity.ok(ApiResponse.success(exists, 
                exists ? "Content exists" : "Content does not exist"));
    }
    
    /**
     * Delete cached content for a chapter (admin operation).
     * This will force regeneration on next request.
     * 
     * @param chapterName The name of the chapter to reset
     * @return Success response
     */
    @DeleteMapping("/{chapterName}/content")
    public ResponseEntity<ApiResponse<Void>> deleteChapterContent(
            @PathVariable String chapterName) {
        
        log.info("Received request to delete content for chapter: {}", chapterName);
        
        contentGenerationService.deleteChapterContent(chapterName);
        
        return ResponseEntity.ok(ApiResponse.success(null, 
                "Successfully deleted content for chapter: " + chapterName));
    }
}
