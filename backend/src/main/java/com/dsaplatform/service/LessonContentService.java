package com.dsaplatform.service;

import com.dsaplatform.dto.response.LessonContentResponse;
import com.dsaplatform.exception.OpenAIException;
import com.dsaplatform.model.entity.LessonContentCache;
import com.dsaplatform.repository.LessonContentCacheRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Service for generating and caching lesson content using LLM.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class LessonContentService {
    
    private final LessonContentCacheRepository contentRepository;
    private final OpenAIClient openAIClient;
    
    private static final String SYSTEM_PROMPT = """
        You are an expert DSA (Data Structures and Algorithms) educator creating lesson content 
        for Java learners. Your explanations should be in ELI10 (Explain Like I'm 10) style - 
        simple, clear, with relatable analogies and examples.
        
        Format your response as Markdown with:
        - Clear headers (##, ###)
        - Java code examples in ```java blocks
        - ASCII diagrams where helpful
        - Simple explanations with analogies
        - Time/space complexity analysis
        - Key takeaways section at the end
        - Link to code editor at the end: [Open Code Editor](/editor)
        """;
    
    /**
     * Get lesson content. Returns cached content if available, otherwise generates new content.
     * 
     * @param lessonId The lesson identifier
     * @param lessonTitle The lesson title
     * @param topic The topic/subject of the lesson
     * @return LessonContentResponse with content
     */
    @Transactional
    public LessonContentResponse getLessonContent(String lessonId, String lessonTitle, String topic) {
        log.info("📚 Fetching content for lesson: {} ({})", lessonTitle, lessonId);
        
        // Check cache first
        return contentRepository.findByLessonId(lessonId)
                .map(cached -> {
                    log.info("✅ Found cached content for lesson: {}", lessonId);
                    return mapToResponse(cached, true);
                })
                .orElseGet(() -> {
                    log.info("🚀 No cache found. Generating new content for: {}", lessonTitle);
                    return generateAndCacheContent(lessonId, lessonTitle, topic);
                });
    }
    
    /**
     * Generate new content using LLM and cache it.
     */
    private LessonContentResponse generateAndCacheContent(String lessonId, String lessonTitle, String topic) {
        try {
            // Generate content using LLM
            log.info("🤖 Calling LLM to generate content for: {}", lessonTitle);
            String content = generateContentWithLLM(lessonTitle, topic);
            
            // Cache the content
            LessonContentCache cached = LessonContentCache.builder()
                    .lessonId(lessonId)
                    .lessonTitle(lessonTitle)
                    .topic(topic)
                    .content(content)
                    .generatedAt(LocalDateTime.now())
                    .contentLength(content.length())
                    .build();
            
            contentRepository.save(cached);
            log.info("✅ Generated and cached content for: {} ({} chars)", lessonTitle, content.length());
            
            return mapToResponse(cached, false);
            
        } catch (OpenAIException e) {
            log.error("❌ Failed to generate content using LLM for: {}", lessonTitle, e);
            throw new OpenAIException("Failed to generate lesson content: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("💥 Unexpected error generating content for: {}", lessonTitle, e);
            throw new RuntimeException("Failed to generate lesson content: " + e.getMessage(), e);
        }
    }
    
    /**
     * Generate content using OpenRouter LLM.
     */
    private String generateContentWithLLM(String lessonTitle, String topic) {
        String userPrompt = buildLessonPrompt(lessonTitle, topic);
        
        log.debug("📤 Sending request to LLM for lesson: {}", lessonTitle);
        String response = openAIClient.createChatCompletion(SYSTEM_PROMPT, userPrompt);
        log.debug("📥 Received LLM response ({} chars)", response.length());
        
        return response;
    }
    
    /**
     * Build the prompt for LLM content generation.
     */
    private String buildLessonPrompt(String lessonTitle, String topic) {
        return String.format("""
            Create a comprehensive lesson about "%s" in Java for beginner students learning %s.
            
            Requirements:
            - Use Markdown format with clear headers
            - Start with "# %s" as the main title
            - Include Java code examples in ```java blocks
            - Use ELI10 style: simple language, relatable analogies
            - Add ASCII diagrams where helpful (for visualizing data structures)
            - Explain time and space complexity where relevant
            - Include practical examples and use cases
            - Add a "Key Takeaways" section at the end with ✅ bullet points
            - End with: [Open Code Editor](/editor)
            - Length: 600-1000 words
            - Make it engaging and easy to understand
            
            Generate the lesson content now in Markdown format:
            """, 
            lessonTitle, topic, lessonTitle);
    }
    
    /**
     * Map entity to response DTO.
     */
    private LessonContentResponse mapToResponse(LessonContentCache cached, boolean fromCache) {
        return LessonContentResponse.builder()
                .lessonId(cached.getLessonId())
                .lessonTitle(cached.getLessonTitle())
                .topic(cached.getTopic())
                .content(cached.getContent())
                .generatedAt(cached.getGeneratedAt())
                .cached(fromCache)
                .build();
    }
    
    /**
     * Delete cached content for a lesson (admin operation).
     */
    @Transactional
    public void deleteCachedContent(String lessonId) {
        log.info("🗑️ Deleting cached content for lesson: {}", lessonId);
        contentRepository.deleteByLessonId(lessonId);
    }
    
    /**
     * Check if content exists in cache.
     */
    public boolean hasContent(String lessonId) {
        return contentRepository.existsByLessonId(lessonId);
    }
}
