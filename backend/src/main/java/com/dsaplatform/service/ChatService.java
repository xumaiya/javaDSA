package com.dsaplatform.service;

import com.dsaplatform.dto.request.ChatRequest;
import com.dsaplatform.dto.response.ChatResponse;
import com.dsaplatform.dto.response.ChatResponse.ChapterReference;
import com.dsaplatform.exception.OpenAIException;
import com.dsaplatform.model.entity.ChatLog;
import com.dsaplatform.model.entity.Chapter;
import com.dsaplatform.model.entity.LessonEmbedding;
import com.dsaplatform.repository.ChatLogRepository;
import com.dsaplatform.repository.LessonEmbeddingRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for processing chat questions using RAG (Retrieval-Augmented Generation).
 * Handles question processing, context retrieval, and chat logging.
 * 
 * Requirements: 1.1, 1.2, 3.1, 3.2, 3.3, 3.4
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final EmbeddingService embeddingService;
    private final OpenAIClient openAIClient;
    private final LessonEmbeddingRepository lessonEmbeddingRepository;
    private final ChatLogRepository chatLogRepository;
    private final ObjectMapper objectMapper;

    @Value("${rag.top-k-results:5}")
    private int topKResults;

    @Value("${rag.similarity-threshold:0.7}")
    private double similarityThreshold;

    private static final String SYSTEM_PROMPT = """
        You are a helpful assistant for a DSA (Data Structures and Algorithms) learning platform.
        Answer the user's question based on the provided context from course materials.
        If the context doesn't contain enough information to answer the question fully,
        acknowledge this and provide what information you can based on the available context.
        Be clear, concise, and educational in your responses.
        """;

    /**
     * Processes a user question using RAG approach.
     */
    @Transactional
    public ChatResponse processQuestion(ChatRequest request, Long userId) {
        log.info("Processing question for user {}: {}", userId, 
                truncateForLog(request.getMessage()));
        
        LocalDateTime questionTimestamp = LocalDateTime.now();
        
        ChatLog chatLog = createInitialChatLog(userId, request.getMessage(), questionTimestamp);
        
        try {
            // Step 1: Generate embedding for user question
            List<double[]> queryEmbeddings = openAIClient.createEmbeddings(List.of(request.getMessage()));
            
            if (queryEmbeddings.isEmpty()) {
                throw new OpenAIException("Failed to generate embedding for question");
            }
            
            double[] queryVector = queryEmbeddings.get(0);
            
            // Step 2: Retrieve similar chunks using in-memory cosine similarity
            List<LessonEmbedding> allEmbeddings = lessonEmbeddingRepository.findAllWithEmbeddings();
            List<ScoredEmbedding> similarChunks = findSimilarEmbeddings(queryVector, allEmbeddings, topKResults, similarityThreshold);
            
            log.debug("Retrieved {} similar chunks for question", similarChunks.size());
            
            // Step 3: Calculate confidence score
            double confidenceScore = calculateConfidenceScore(similarChunks);
            
            // Step 4: Build context from retrieved chunks
            List<LessonEmbedding> chunks = similarChunks.stream()
                    .map(ScoredEmbedding::getEmbedding)
                    .collect(Collectors.toList());
            String context = buildContext(chunks);
            
            // Step 5: Call chat completion
            String userPrompt = buildUserPrompt(request.getMessage(), context);
            String aiResponse = openAIClient.createChatCompletion(SYSTEM_PROMPT, userPrompt);
            
            // Step 6: Extract related chapter references
            List<ChapterReference> chapterReferences = extractChapterReferences(chunks);
            
            // Update ChatLog with response
            updateChatLogWithResponse(chatLog, aiResponse, confidenceScore, 
                    chunks.size(), chapterReferences);
            
            return ChatResponse.builder()
                    .id("chat_" + chatLog.getId())
                    .content(aiResponse)
                    .confidenceScore(confidenceScore)
                    .relatedChapters(chapterReferences)
                    .timestamp(LocalDateTime.now())
                    .build();
                    
        } catch (OpenAIException e) {
            log.error("API error while processing question", e);
            updateChatLogWithError(chatLog, "API error: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error processing question", e);
            updateChatLogWithError(chatLog, "Error: " + e.getMessage());
            throw new RuntimeException("Failed to process question", e);
        }
    }

    /**
     * Find similar embeddings using cosine similarity (in-memory).
     */
    private List<ScoredEmbedding> findSimilarEmbeddings(double[] queryVector, 
            List<LessonEmbedding> allEmbeddings, int topK, double threshold) {
        
        return allEmbeddings.stream()
                .map(embedding -> {
                    double[] embVector = embedding.getEmbeddingVector();
                    double similarity = cosineSimilarity(queryVector, embVector);
                    return new ScoredEmbedding(embedding, similarity);
                })
                .filter(scored -> scored.getScore() >= threshold)
                .sorted((a, b) -> Double.compare(b.getScore(), a.getScore()))
                .limit(topK)
                .collect(Collectors.toList());
    }

    /**
     * Calculate cosine similarity between two vectors.
     */
    private double cosineSimilarity(double[] a, double[] b) {
        if (a == null || b == null || a.length == 0 || b.length == 0 || a.length != b.length) {
            return 0.0;
        }
        
        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;
        
        for (int i = 0; i < a.length; i++) {
            dotProduct += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        
        if (normA == 0 || normB == 0) {
            return 0.0;
        }
        
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    /**
     * Helper class to hold embedding with its similarity score.
     */
    private static class ScoredEmbedding {
        private final LessonEmbedding embedding;
        private final double score;
        
        ScoredEmbedding(LessonEmbedding embedding, double score) {
            this.embedding = embedding;
            this.score = score;
        }
        
        LessonEmbedding getEmbedding() { return embedding; }
        double getScore() { return score; }
    }

    private ChatLog createInitialChatLog(Long userId, String question, LocalDateTime timestamp) {
        ChatLog chatLog = ChatLog.builder()
                .userId(userId)
                .userQuestion(question)
                .questionTimestamp(timestamp)
                .build();
        
        return chatLogRepository.save(chatLog);
    }

    private void updateChatLogWithResponse(ChatLog chatLog, String response, 
            double confidenceScore, int retrievedChunks, List<ChapterReference> chapters) {
        
        chatLog.setBotResponse(response);
        chatLog.setConfidenceScore(BigDecimal.valueOf(confidenceScore)
                .setScale(4, RoundingMode.HALF_UP));
        chatLog.setRetrievedChunks(retrievedChunks);
        chatLog.setResponseTimestamp(LocalDateTime.now());
        
        List<Long> chapterIds = chapters.stream()
                .map(ChapterReference::getChapterId)
                .collect(Collectors.toList());
        try {
            chatLog.setRelatedChapterIds(objectMapper.writeValueAsString(chapterIds));
        } catch (JsonProcessingException e) {
            log.warn("Failed to serialize chapter IDs", e);
            chatLog.setRelatedChapterIds("[]");
        }
        
        chatLogRepository.save(chatLog);
        log.debug("Updated chat log {} with response", chatLog.getId());
    }

    private void updateChatLogWithError(ChatLog chatLog, String errorMessage) {
        chatLog.setBotResponse("Error: " + errorMessage);
        chatLog.setResponseTimestamp(LocalDateTime.now());
        chatLog.setConfidenceScore(BigDecimal.ZERO);
        chatLog.setRetrievedChunks(0);
        chatLog.setRelatedChapterIds("[]");
        
        chatLogRepository.save(chatLog);
        log.debug("Updated chat log {} with error state", chatLog.getId());
    }

    private double calculateConfidenceScore(List<ScoredEmbedding> scoredChunks) {
        if (scoredChunks == null || scoredChunks.isEmpty()) {
            return 0.0;
        }
        
        // Average similarity score of retrieved chunks
        double avgSimilarity = scoredChunks.stream()
                .mapToDouble(ScoredEmbedding::getScore)
                .average()
                .orElse(0.0);
        
        // Factor in how many chunks were found
        double chunkRatio = Math.min(1.0, (double) scoredChunks.size() / topKResults);
        
        // Weighted combination
        double confidence = (avgSimilarity * 0.7) + (chunkRatio * 0.3);
        
        return Math.min(1.0, Math.max(0.0, confidence));
    }

    private String buildContext(List<LessonEmbedding> chunks) {
        if (chunks == null || chunks.isEmpty()) {
            return "No relevant context found in the course materials.";
        }
        
        StringBuilder contextBuilder = new StringBuilder();
        
        for (int i = 0; i < chunks.size(); i++) {
            LessonEmbedding chunk = chunks.get(i);
            String lessonTitle = chunk.getLesson() != null ? chunk.getLesson().getTitle() : "Unknown";
            String chapterTitle = getChapterTitle(chunk);
            
            contextBuilder.append(String.format("[Source %d - %s > %s]\n", 
                    i + 1, chapterTitle, lessonTitle));
            contextBuilder.append(chunk.getChunkText());
            contextBuilder.append("\n\n");
        }
        
        return contextBuilder.toString().trim();
    }

    private String buildUserPrompt(String question, String context) {
        return String.format("""
            Context from course materials:
            %s
            
            User Question: %s
            
            Please provide a helpful answer based on the context above.
            """, context, question);
    }

    private List<ChapterReference> extractChapterReferences(List<LessonEmbedding> chunks) {
        if (chunks == null || chunks.isEmpty()) {
            return Collections.emptyList();
        }
        
        Map<Long, ChapterInfo> chapterMap = new LinkedHashMap<>();
        
        for (int i = 0; i < chunks.size(); i++) {
            LessonEmbedding chunk = chunks.get(i);
            Chapter chapter = getChapter(chunk);
            
            if (chapter != null) {
                Long chapterId = chapter.getId();
                ChapterInfo info = chapterMap.computeIfAbsent(chapterId, 
                        id -> new ChapterInfo(chapterId, chapter.getTitle(), 0, 0.0));
                
                double weight = 1.0 - (i * 0.1);
                info.totalWeight += Math.max(0.1, weight);
                info.count++;
            }
        }
        
        double maxWeight = chapterMap.values().stream()
                .mapToDouble(info -> info.totalWeight)
                .max()
                .orElse(1.0);
        
        return chapterMap.values().stream()
                .map(info -> ChapterReference.builder()
                        .chapterId(info.chapterId)
                        .chapterTitle(info.title)
                        .relevanceScore(Math.min(1.0, info.totalWeight / maxWeight))
                        .build())
                .sorted((a, b) -> Double.compare(b.getRelevanceScore(), a.getRelevanceScore()))
                .collect(Collectors.toList());
    }

    private static class ChapterInfo {
        Long chapterId;
        String title;
        int count;
        double totalWeight;
        
        ChapterInfo(Long chapterId, String title, int count, double totalWeight) {
            this.chapterId = chapterId;
            this.title = title;
            this.count = count;
            this.totalWeight = totalWeight;
        }
    }

    private Chapter getChapter(LessonEmbedding chunk) {
        if (chunk.getLesson() != null && chunk.getLesson().getChapter() != null) {
            return chunk.getLesson().getChapter();
        }
        return null;
    }

    private String getChapterTitle(LessonEmbedding chunk) {
        Chapter chapter = getChapter(chunk);
        return chapter != null ? chapter.getTitle() : "Unknown Chapter";
    }

    public Page<ChatLog> getChatHistory(Long userId, Pageable pageable) {
        log.debug("Retrieving chat history for user {} with pagination {}", userId, pageable);
        return chatLogRepository.findByUserIdOrderByQuestionTimestampDesc(userId, pageable);
    }

    private String truncateForLog(String message) {
        if (message == null) return "null";
        return message.length() > 100 ? message.substring(0, 100) + "..." : message;
    }
}
