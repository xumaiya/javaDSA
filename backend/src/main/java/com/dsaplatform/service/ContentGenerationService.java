package com.dsaplatform.service;

import com.dsaplatform.dto.response.ChapterContentResponse;
import com.dsaplatform.exception.ContentNotFoundException;
import com.dsaplatform.exception.OpenAIException;
import com.dsaplatform.model.entity.ChapterContent;
import com.dsaplatform.model.entity.LessonContent;
import com.dsaplatform.repository.ChapterContentRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for generating and managing dynamic chapter content using LLM.
 * Implements caching strategy: generate once, store in DB, retrieve on subsequent requests.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ContentGenerationService {
    
    private final ChapterContentRepository chapterContentRepository;
    private final OpenAIClient openAIClient;
    private final ObjectMapper objectMapper;
    
    private static final String SYSTEM_PROMPT = """
        You are an expert DSA (Data Structures and Algorithms) educator creating beginner-friendly 
        course content for Java learners. Your explanations should be in ELI10 (Explain Like I'm 10) 
        style - simple, clear, with relatable analogies and examples.
        
        You MUST respond with ONLY valid JSON in the exact format specified, with no additional text 
        before or after the JSON.
        """;
    
    /**
     * Get chapter content with lessons. If not cached, generate using LLM and store.
     * 
     * @param chapterName The name of the chapter (e.g., "Stack", "Queue", "Linked List")
     * @return ChapterContentResponse with lessons
     */
    @Transactional
    public ChapterContentResponse getOrGenerateChapterContent(String chapterName) {
        log.info("Fetching content for chapter: {}", chapterName);
        
        // Validate input
        if (chapterName == null || chapterName.isBlank()) {
            throw new IllegalArgumentException("Chapter name cannot be empty");
        }
        
        String normalizedChapterName = chapterName.trim();
        
        // Check if content already exists in database
        return chapterContentRepository.findByChapterNameIgnoreCase(normalizedChapterName)
                .map(content -> {
                    log.info("Found cached content for chapter: {}", normalizedChapterName);
                    return mapToResponse(content, true);
                })
                .orElseGet(() -> {
                    log.info("No cached content found. Generating new content for chapter: {}", normalizedChapterName);
                    return generateAndStoreContent(normalizedChapterName);
                });
    }
    
    /**
     * Generate new content using LLM and store in database.
     */
    private ChapterContentResponse generateAndStoreContent(String chapterName) {
        try {
            // Generate content using LLM
            String llmResponse = generateContentWithLLM(chapterName);
            
            // Parse LLM response
            ChapterContent chapterContent = parseLLMResponse(chapterName, llmResponse);
            
            // Save to database
            ChapterContent savedContent = chapterContentRepository.save(chapterContent);
            log.info("Successfully generated and stored content for chapter: {} with {} lessons", 
                    chapterName, savedContent.getLessons().size());
            
            return mapToResponse(savedContent, false);
            
        } catch (OpenAIException e) {
            log.error("Failed to generate content using LLM for chapter: {}", chapterName, e);
            throw new OpenAIException("Failed to generate chapter content: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error generating content for chapter: {}", chapterName, e);
            throw new RuntimeException("Failed to generate chapter content: " + e.getMessage(), e);
        }
    }
    
    /**
     * Generate content using OpenRouter LLM.
     */
    private String generateContentWithLLM(String chapterName) {
        String userPrompt = buildContentGenerationPrompt(chapterName);
        
        log.debug("Sending content generation request to LLM for chapter: {}", chapterName);
        String response = openAIClient.createChatCompletion(SYSTEM_PROMPT, userPrompt);
        log.debug("Received LLM response for chapter: {}", chapterName);
        
        return response;
    }
    
    /**
     * Build the prompt for LLM content generation.
     */
    private String buildContentGenerationPrompt(String chapterName) {
        return String.format("""
            Generate comprehensive learning content for the DSA topic: "%s" in Java.
            
            Create 5 lessons that progressively teach this topic to beginners.
            
            Respond with ONLY this JSON structure (no markdown, no extra text):
            
            {
              "chapterTitle": "Clear title for %s",
              "chapterDescription": "Brief overview of what students will learn",
              "lessons": [
                {
                  "lessonTitle": "Lesson 1 title",
                  "lessonExplanation": "Detailed explanation in ELI10 style with examples and optional small Java code snippets",
                  "lessonOrder": 1,
                  "estimatedDuration": 15
                },
                {
                  "lessonTitle": "Lesson 2 title",
                  "lessonExplanation": "Detailed explanation...",
                  "lessonOrder": 2,
                  "estimatedDuration": 20
                }
              ]
            }
            
            Requirements:
            - Create exactly 5 lessons
            - Use ELI10 style: simple language, relatable analogies (like "think of a stack like a pile of plates")
            - Include practical Java examples where appropriate
            - Each lesson should build on previous ones
            - Estimated duration should be realistic (10-30 minutes per lesson)
            - Explanations should be detailed (200-500 words per lesson)
            - Use markdown formatting in explanations (headers, code blocks, lists)
            - Focus on understanding concepts before implementation
            
            Generate the content now in the exact JSON format above.
            """, chapterName, chapterName);
    }
    
    /**
     * Parse LLM JSON response into ChapterContent entity.
     */
    private ChapterContent parseLLMResponse(String chapterName, String llmResponse) {
        try {
            // Clean response - remove markdown code blocks if present
            String cleanedResponse = llmResponse.trim();
            if (cleanedResponse.startsWith("```json")) {
                cleanedResponse = cleanedResponse.substring(7);
            }
            if (cleanedResponse.startsWith("```")) {
                cleanedResponse = cleanedResponse.substring(3);
            }
            if (cleanedResponse.endsWith("```")) {
                cleanedResponse = cleanedResponse.substring(0, cleanedResponse.length() - 3);
            }
            cleanedResponse = cleanedResponse.trim();
            
            // Parse JSON
            JsonNode rootNode = objectMapper.readTree(cleanedResponse);
            
            // Extract chapter info
            String chapterTitle = rootNode.path("chapterTitle").asText();
            String chapterDescription = rootNode.path("chapterDescription").asText();
            
            // Create ChapterContent entity
            ChapterContent chapterContent = ChapterContent.builder()
                    .chapterName(chapterName)
                    .chapterTitle(chapterTitle)
                    .chapterDescription(chapterDescription)
                    .generatedAt(LocalDateTime.now())
                    .lessons(new ArrayList<>())
                    .build();
            
            // Parse lessons
            JsonNode lessonsNode = rootNode.path("lessons");
            if (!lessonsNode.isArray()) {
                throw new IllegalArgumentException("Lessons must be an array");
            }
            
            for (JsonNode lessonNode : lessonsNode) {
                LessonContent lesson = LessonContent.builder()
                        .lessonTitle(lessonNode.path("lessonTitle").asText())
                        .lessonExplanation(lessonNode.path("lessonExplanation").asText())
                        .lessonOrder(lessonNode.path("lessonOrder").asInt())
                        .estimatedDuration(lessonNode.path("estimatedDuration").asInt(15))
                        .chapterContent(chapterContent)
                        .build();
                
                chapterContent.getLessons().add(lesson);
            }
            
            // Validate we have lessons
            if (chapterContent.getLessons().isEmpty()) {
                throw new IllegalArgumentException("No lessons found in LLM response");
            }
            
            log.info("Successfully parsed {} lessons from LLM response", chapterContent.getLessons().size());
            return chapterContent;
            
        } catch (JsonProcessingException e) {
            log.error("Failed to parse LLM response as JSON: {}", llmResponse, e);
            throw new IllegalArgumentException("Invalid JSON response from LLM: " + e.getMessage(), e);
        }
    }
    
    /**
     * Map ChapterContent entity to response DTO.
     */
    private ChapterContentResponse mapToResponse(ChapterContent content, boolean cached) {
        List<ChapterContentResponse.LessonContentResponse> lessons = content.getLessons().stream()
                .map(lesson -> ChapterContentResponse.LessonContentResponse.builder()
                        .id(lesson.getId())
                        .lessonTitle(lesson.getLessonTitle())
                        .lessonExplanation(lesson.getLessonExplanation())
                        .lessonOrder(lesson.getLessonOrder())
                        .estimatedDuration(lesson.getEstimatedDuration())
                        .build())
                .collect(Collectors.toList());
        
        return ChapterContentResponse.builder()
                .id(content.getId())
                .chapterName(content.getChapterName())
                .chapterTitle(content.getChapterTitle())
                .chapterDescription(content.getChapterDescription())
                .lessons(lessons)
                .generatedAt(content.getGeneratedAt())
                .cached(cached)
                .build();
    }
    
    /**
     * Delete cached content for a chapter (admin operation).
     * 
     * @param chapterName The name of the chapter to reset
     */
    @Transactional
    public void deleteChapterContent(String chapterName) {
        log.info("Deleting cached content for chapter: {}", chapterName);
        
        if (!chapterContentRepository.existsByChapterNameIgnoreCase(chapterName)) {
            throw new ContentNotFoundException("No content found for chapter: " + chapterName);
        }
        
        chapterContentRepository.deleteByChapterNameIgnoreCase(chapterName);
        log.info("Successfully deleted content for chapter: {}", chapterName);
    }
    
    /**
     * Check if content exists for a chapter.
     * 
     * @param chapterName The name of the chapter
     * @return true if content exists, false otherwise
     */
    public boolean hasContent(String chapterName) {
        return chapterContentRepository.existsByChapterNameIgnoreCase(chapterName);
    }
}
