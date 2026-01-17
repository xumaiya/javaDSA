package com.dsaplatform.service;

import com.dsaplatform.dto.request.ChatMessageRequest;
import com.dsaplatform.dto.response.ChatMessageResponse;
import com.dsaplatform.model.entity.LessonEmbedding;
import com.dsaplatform.repository.LessonEmbeddingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatbotService {
    
    private final LessonEmbeddingRepository embeddingRepository;
    private final EmbeddingService embeddingService;
    private final OpenAIClient openAIClient;
    
    @Value("${rag.top-k-results:5}")
    private int topKResults;
    
    @Value("${rag.similarity-threshold:0.7}")
    private double similarityThreshold;
    
    private static final String POLITE_DECLINE_MESSAGE = 
        "I'm your DSA learning assistant! I can only help with Data Structures and Algorithms topics. " +
        "Try asking me about arrays, linked lists, trees, graphs, sorting, searching, dynamic programming, or other DSA concepts!";
    
    private static final String SYSTEM_PROMPT = """
        You are a friendly DSA (Data Structures and Algorithms) tutor for a learning platform.
        
        IMPORTANT RULES:
        1. ONLY answer questions related to Data Structures and Algorithms
        2. If asked about anything outside DSA (politics, news, personal advice, other programming topics not related to DSA), \
        politely decline and say: "%s"
        3. Explain concepts in simple, easy-to-understand language suitable for beginners
        4. Use analogies and real-world examples when helpful
        5. When explaining algorithms, break them down step by step
        6. Answer the user's question based on the provided context from course materials when available
        7. Be clear, concise, and educational in your responses
        
        DSA topics you CAN help with:
        - Arrays, Strings, Linked Lists
        - Stacks, Queues, Deques
        - Trees (Binary, BST, AVL, Red-Black, B-trees)
        - Graphs (BFS, DFS, Dijkstra, Bellman-Ford, Floyd-Warshall, etc.)
        - Sorting algorithms (Bubble, Selection, Insertion, Merge, Quick, Heap, Radix, Counting)
        - Searching algorithms (Linear, Binary, Interpolation)
        - Dynamic Programming
        - Recursion and Backtracking
        - Hash Tables and Hashing
        - Heaps and Priority Queues
        - Time and Space Complexity (Big O notation)
        - Greedy Algorithms
        - Divide and Conquer
        - Trie and Suffix Trees
        - Disjoint Set Union (Union-Find)
        - Segment Trees and Fenwick Trees
        """.formatted(POLITE_DECLINE_MESSAGE);
    
    public ChatMessageResponse processMessage(ChatMessageRequest request) {
        try {
            // Generate embedding for user query
            List<double[]> queryEmbeddings = openAIClient.createEmbeddings(List.of(request.getMessage()));
            
            if (queryEmbeddings.isEmpty()) {
                return createErrorResponse("Failed to process your question.");
            }
            
            double[] queryVector = queryEmbeddings.get(0);
            
            // Find similar lesson chunks using in-memory cosine similarity
            List<LessonEmbedding> allEmbeddings = embeddingRepository.findAllWithEmbeddings();
            List<LessonEmbedding> similarChunks = findSimilarEmbeddings(queryVector, allEmbeddings);
            
            // Build context from similar chunks
            String context = buildContext(similarChunks);
            
            // Build user prompt with context
            String userPrompt = String.format(
                "Context from course materials:\n%s\n\nUser Question: %s\n\nPlease provide a helpful answer based on the context above.",
                context,
                request.getMessage()
            );
            
            // Call LLM with context
            String response = openAIClient.createChatCompletion(SYSTEM_PROMPT, userPrompt);
            
            return ChatMessageResponse.builder()
                    .id("msg_" + System.currentTimeMillis())
                    .role("assistant")
                    .content(response)
                    .timestamp(LocalDateTime.now())
                    .build();
        } catch (Exception e) {
            log.error("Error processing chat message", e);
            return createErrorResponse("Sorry, I encountered an error processing your message. Please try again.");
        }
    }
    
    private List<LessonEmbedding> findSimilarEmbeddings(double[] queryVector, List<LessonEmbedding> allEmbeddings) {
        return allEmbeddings.stream()
                .map(embedding -> new ScoredEmbedding(embedding, cosineSimilarity(queryVector, embedding.getEmbeddingVector())))
                .filter(scored -> scored.score >= similarityThreshold)
                .sorted(Comparator.comparingDouble(ScoredEmbedding::score).reversed())
                .limit(topKResults)
                .map(ScoredEmbedding::embedding)
                .collect(Collectors.toList());
    }
    
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
    
    private record ScoredEmbedding(LessonEmbedding embedding, double score) {}
    
    private String buildContext(List<LessonEmbedding> chunks) {
        if (chunks.isEmpty()) {
            return "No relevant context found in the course materials.";
        }
        return chunks.stream()
                .map(LessonEmbedding::getChunkText)
                .collect(Collectors.joining("\n\n"));
    }
    
    private ChatMessageResponse createErrorResponse(String message) {
        return ChatMessageResponse.builder()
                .id("msg_error_" + System.currentTimeMillis())
                .role("assistant")
                .content(message)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
