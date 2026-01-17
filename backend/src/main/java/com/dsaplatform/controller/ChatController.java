package com.dsaplatform.controller;

import com.dsaplatform.dto.request.ChatRequest;
import com.dsaplatform.dto.request.EmbedContentRequest;
import com.dsaplatform.dto.response.ApiResponse;
import com.dsaplatform.dto.response.ChatResponse;
import com.dsaplatform.dto.response.EmbedResponse;
import com.dsaplatform.model.entity.ChatLog;
import com.dsaplatform.service.ChatService;
import com.dsaplatform.service.EmbeddingService;
import com.dsaplatform.util.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

/**
 * REST Controller for RAG chatbot functionality.
 * Provides endpoints for asking questions, embedding content, and retrieving chat history.
 * 
 * Requirements: 1.1, 2.1, 3.4
 */
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatService chatService;
    private final EmbeddingService embeddingService;
    private final SecurityUtil securityUtil;

    /**
     * Process a user question using RAG approach.
     * Generates embedding for the question, retrieves relevant content,
     * and returns an AI-generated response with metadata.
     * 
     * Requirements: 1.1
     * 
     * @param request The chat request containing the user's question
     * @param authentication The current user's authentication
     * @return ChatResponse with AI-generated answer and metadata
     */
    @PostMapping("/ask")
    public ResponseEntity<ApiResponse<ChatResponse>> askQuestion(
            @Valid @RequestBody ChatRequest request,
            Authentication authentication) {
        
        Long userId = securityUtil.getUserId(authentication);
        log.info("Processing question for user {}", userId);
        
        ChatResponse response = chatService.processQuestion(request, userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * Embed lesson content into the vector database.
     * Chunks the lesson content, generates embeddings via OpenAI,
     * and stores them for similarity search.
     * 
     * Requirements: 2.1
     * 
     * @param request The embed content request containing lessonId and optional chunk parameters
     * @return EmbedResponse with the number of chunks created
     */
    @PostMapping("/embed-content")
    public ResponseEntity<ApiResponse<EmbedResponse>> embedContent(
            @Valid @RequestBody EmbedContentRequest request) {
        
        log.info("Embedding content for lesson {}", request.getLessonId());
        
        int chunksCreated = embeddingService.embedLessonContent(
                request.getLessonId(),
                request.getChunkSize(),
                request.getChunkOverlap()
        );
        
        EmbedResponse response = EmbedResponse.builder()
                .lessonId(request.getLessonId())
                .chunksCreated(chunksCreated)
                .status("SUCCESS")
                .timestamp(LocalDateTime.now())
                .build();
        
        return ResponseEntity.ok(ApiResponse.success(response, 
                "Successfully embedded " + chunksCreated + " chunks"));
    }

    /**
     * Retrieve chat history for the current user with pagination.
     * 
     * Requirements: 3.4
     * 
     * @param authentication The current user's authentication
     * @param pageable Pagination parameters
     * @return Page of chat logs for the user
     */
    @GetMapping("/history")
    public ResponseEntity<ApiResponse<Page<ChatLog>>> getChatHistory(
            Authentication authentication,
            @PageableDefault(size = 20, sort = "questionTimestamp") Pageable pageable) {
        
        Long userId = securityUtil.getUserId(authentication);
        log.debug("Retrieving chat history for user {}", userId);
        
        Page<ChatLog> history = chatService.getChatHistory(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(history));
    }
}
