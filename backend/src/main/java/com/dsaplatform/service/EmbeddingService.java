package com.dsaplatform.service;

import com.dsaplatform.exception.ContentNotFoundException;
import com.dsaplatform.model.entity.Lesson;
import com.dsaplatform.model.entity.LessonEmbedding;
import com.dsaplatform.repository.LessonEmbeddingRepository;
import com.dsaplatform.repository.LessonRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for generating and managing text embeddings.
 * Handles text chunking, embedding generation via OpenRouter, and storage.
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmbeddingService {
    
    private final OpenAIClient openAIClient;
    private final LessonRepository lessonRepository;
    private final LessonEmbeddingRepository lessonEmbeddingRepository;
    
    @Value("${rag.chunk-size:500}")
    private int defaultChunkSize;
    
    @Value("${rag.chunk-overlap:50}")
    private int defaultChunkOverlap;
    
    /**
     * Represents a text chunk with its index.
     */
    @Data
    @AllArgsConstructor
    public static class TextChunk {
        private String text;
        private int index;
    }
    
    /**
     * Splits text into chunks of configurable size with overlap.
     * 
     * Requirements: 2.2
     */
    public List<TextChunk> chunkText(String text, int chunkSize, int overlap) {
        if (text == null || text.isEmpty()) {
            return Collections.emptyList();
        }
        
        if (chunkSize <= 0) {
            throw new IllegalArgumentException("Chunk size must be positive");
        }
        if (overlap < 0) {
            throw new IllegalArgumentException("Overlap cannot be negative");
        }
        if (overlap >= chunkSize) {
            throw new IllegalArgumentException("Overlap must be less than chunk size");
        }
        
        List<TextChunk> chunks = new ArrayList<>();
        int textLength = text.length();
        
        if (textLength <= chunkSize) {
            chunks.add(new TextChunk(text, 0));
            return chunks;
        }
        
        int step = chunkSize - overlap;
        int chunkIndex = 0;
        int position = 0;
        
        while (position < textLength) {
            int endPosition = Math.min(position + chunkSize, textLength);
            String chunk = text.substring(position, endPosition);
            chunks.add(new TextChunk(chunk, chunkIndex));
            
            chunkIndex++;
            position += step;
            
            if (step <= 0) {
                break;
            }
        }
        
        return chunks;
    }
    
    /**
     * Chunks text using default configuration values.
     */
    public List<TextChunk> chunkText(String text) {
        return chunkText(text, defaultChunkSize, defaultChunkOverlap);
    }
    
    /**
     * Embeds lesson content by chunking, generating embeddings, and storing them.
     * Replaces any existing embeddings for the lesson (idempotent operation).
     * 
     * Requirements: 2.1, 2.3, 2.4
     */
    @Transactional
    public int embedLessonContent(Long lessonId, Integer chunkSize, Integer chunkOverlap) {
        log.info("Starting embedding process for lesson ID: {}", lessonId);
        
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ContentNotFoundException("Lesson", lessonId));
        
        String content = lesson.getContent();
        if (content == null || content.isBlank()) {
            log.warn("Lesson {} has no content to embed", lessonId);
            return 0;
        }
        
        int effectiveChunkSize = chunkSize != null ? chunkSize : defaultChunkSize;
        int effectiveOverlap = chunkOverlap != null ? chunkOverlap : defaultChunkOverlap;
        
        List<TextChunk> chunks = chunkText(content, effectiveChunkSize, effectiveOverlap);
        if (chunks.isEmpty()) {
            log.warn("No chunks generated for lesson {}", lessonId);
            return 0;
        }
        
        log.debug("Generated {} chunks for lesson {}", chunks.size(), lessonId);
        
        List<String> chunkTexts = chunks.stream()
                .map(TextChunk::getText)
                .collect(Collectors.toList());
        
        List<double[]> embeddings = openAIClient.createEmbeddings(chunkTexts);
        
        if (embeddings.size() != chunks.size()) {
            log.error("Embedding count mismatch: expected {}, got {}", chunks.size(), embeddings.size());
            throw new IllegalStateException("Failed to generate embeddings for all chunks");
        }
        
        // Delete existing embeddings for this lesson (idempotent)
        lessonEmbeddingRepository.deleteByLessonId(lessonId);
        lessonEmbeddingRepository.flush();
        
        // Store new embeddings
        List<LessonEmbedding> newEmbeddings = new ArrayList<>();
        for (int i = 0; i < chunks.size(); i++) {
            TextChunk chunk = chunks.get(i);
            double[] embeddingVector = embeddings.get(i);
            
            LessonEmbedding lessonEmbedding = LessonEmbedding.builder()
                    .lesson(lesson)
                    .chunkText(chunk.getText())
                    .chunkIndex(chunk.getIndex())
                    .embedding(convertToStorageFormat(embeddingVector))
                    .build();
            
            newEmbeddings.add(lessonEmbedding);
        }
        
        lessonEmbeddingRepository.saveAll(newEmbeddings);
        log.info("Successfully created {} embeddings for lesson {}", newEmbeddings.size(), lessonId);
        
        return newEmbeddings.size();
    }
    
    /**
     * Embeds lesson content using default chunk parameters.
     */
    @Transactional
    public int embedLessonContent(Long lessonId) {
        return embedLessonContent(lessonId, null, null);
    }
    
    /**
     * Converts a double array embedding to storage format string.
     */
    private String convertToStorageFormat(double[] embedding) {
        return "[" + Arrays.stream(embedding)
                .mapToObj(String::valueOf)
                .collect(Collectors.joining(",")) + "]";
    }
    
    /**
     * Generates embedding for a single text.
     */
    public String generateEmbedding(String text) {
        try {
            List<double[]> embeddings = openAIClient.createEmbeddings(List.of(text));
            
            if (!embeddings.isEmpty()) {
                return convertToStorageFormat(embeddings.get(0));
            }
        } catch (Exception e) {
            log.error("Error generating embedding", e);
        }
        
        // Return zero vector as fallback
        return "[" + String.join(",", Collections.nCopies(1536, "0.0")) + "]";
    }
    
    /**
     * Embed all lessons in the database.
     */
    @Transactional
    public int embedAllLessons() {
        List<Lesson> lessons = lessonRepository.findAll();
        int totalEmbeddings = 0;
        
        for (Lesson lesson : lessons) {
            try {
                totalEmbeddings += embedLessonContent(lesson.getId());
            } catch (Exception e) {
                log.error("Failed to embed lesson {}: {}", lesson.getId(), e.getMessage());
            }
        }
        
        log.info("Embedded {} total chunks across {} lessons", totalEmbeddings, lessons.size());
        return totalEmbeddings;
    }
}
