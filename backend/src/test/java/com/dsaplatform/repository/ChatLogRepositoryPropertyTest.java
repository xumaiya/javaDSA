package com.dsaplatform.repository;

import com.dsaplatform.model.entity.ChatLog;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Property-based tests for ChatLogRepository.
 * 
 * Feature: rag-chatbot-backend, Property 7: Chat History Filtering
 * Validates: Requirements 3.4
 * 
 * Property: For any user with N chat logs, querying chat history with that user's ID 
 * SHALL return exactly N logs (or paginated subset), and all returned logs SHALL have 
 * user_id matching the query parameter.
 */
@DataJpaTest
@ActiveProfiles("test")
class ChatLogRepositoryPropertyTest {

    @Autowired
    private ChatLogRepository chatLogRepository;

    @BeforeEach
    void setUp() {
        chatLogRepository.deleteAll();
    }

    /**
     * Feature: rag-chatbot-backend, Property 7: Chat History Filtering
     * Validates: Requirements 3.4
     * 
     * Property: For any user with N chat logs, querying chat history with that user's ID 
     * SHALL return exactly N logs (or paginated subset), and all returned logs SHALL have 
     * user_id matching the query parameter.
     */
    @ParameterizedTest
    @CsvSource({
        "1, 2, 5, 3",
        "100, 200, 10, 5",
        "50, 51, 0, 10",
        "999, 1000, 15, 0"
    })
    @DisplayName("Chat history filtering returns only user logs")
    void chatHistoryFilteringReturnsOnlyUserLogs(
            Long targetUserId,
            Long otherUserId,
            int targetUserLogCount,
            int otherUserLogCount
    ) {
        // Create chat logs for target user
        for (int i = 0; i < targetUserLogCount; i++) {
            ChatLog log = createChatLog(targetUserId, "Question " + i, "Response " + i);
            chatLogRepository.save(log);
        }
        
        // Create chat logs for other user
        for (int i = 0; i < otherUserLogCount; i++) {
            ChatLog log = createChatLog(otherUserId, "Other Question " + i, "Other Response " + i);
            chatLogRepository.save(log);
        }
        
        // Query chat history for target user with pagination large enough to get all
        Page<ChatLog> result = chatLogRepository.findByUserIdOrderByQuestionTimestampDesc(
                targetUserId, 
                PageRequest.of(0, Math.max(1, targetUserLogCount + 10))
        );
        
        // Property 1: Should return exactly N logs for the target user
        assertThat(result.getTotalElements()).isEqualTo(targetUserLogCount);
        
        // Property 2: All returned logs should have user_id matching the query parameter
        assertThat(result.getContent())
                .allMatch(log -> log.getUserId().equals(targetUserId),
                        "All returned logs should belong to the target user");
    }

    /**
     * Feature: rag-chatbot-backend, Property 7: Chat History Filtering
     * Validates: Requirements 3.4
     * 
     * Property: Pagination should correctly limit results while maintaining user filtering.
     */
    @ParameterizedTest
    @CsvSource({
        "1, 15, 5",
        "100, 20, 3",
        "50, 10, 10",
        "999, 25, 7"
    })
    @DisplayName("Pagination respects user filtering")
    void paginationRespectsUserFiltering(
            Long userId,
            int totalLogs,
            int pageSize
    ) {
        // Create chat logs for user
        for (int i = 0; i < totalLogs; i++) {
            ChatLog log = createChatLog(userId, "Question " + i, "Response " + i);
            chatLogRepository.save(log);
        }
        
        // Query first page
        Page<ChatLog> firstPage = chatLogRepository.findByUserIdOrderByQuestionTimestampDesc(
                userId, 
                PageRequest.of(0, pageSize)
        );
        
        // Property: Page size should be respected
        assertThat(firstPage.getContent().size()).isLessThanOrEqualTo(pageSize);
        
        // Property: Total elements should equal total logs created
        assertThat(firstPage.getTotalElements()).isEqualTo(totalLogs);
        
        // Property: All returned logs should belong to the user
        assertThat(firstPage.getContent())
                .allMatch(log -> log.getUserId().equals(userId));
    }

    /**
     * Feature: rag-chatbot-backend, Property 7: Chat History Filtering
     * Validates: Requirements 3.4
     * 
     * Property: Results should be ordered by question timestamp descending.
     */
    @Test
    @DisplayName("Results are ordered by timestamp descending")
    void resultsAreOrderedByTimestampDescending() {
        Long userId = 1L;
        int logCount = 10;
        LocalDateTime baseTime = LocalDateTime.now();
        
        // Create chat logs with different timestamps
        for (int i = 0; i < logCount; i++) {
            ChatLog log = ChatLog.builder()
                    .userId(userId)
                    .userQuestion("Question " + i)
                    .botResponse("Response " + i)
                    .confidenceScore(BigDecimal.valueOf(0.85))
                    .retrievedChunks(3)
                    .questionTimestamp(baseTime.minusMinutes(i)) // Earlier timestamps for higher indices
                    .responseTimestamp(baseTime.minusMinutes(i).plusSeconds(5))
                    .build();
            chatLogRepository.save(log);
        }
        
        // Query chat history
        Page<ChatLog> result = chatLogRepository.findByUserIdOrderByQuestionTimestampDesc(
                userId, 
                PageRequest.of(0, logCount + 5)
        );
        
        List<ChatLog> logs = result.getContent();
        
        // Property: Results should be in descending order by question timestamp
        for (int i = 0; i < logs.size() - 1; i++) {
            LocalDateTime current = logs.get(i).getQuestionTimestamp();
            LocalDateTime next = logs.get(i + 1).getQuestionTimestamp();
            assertThat(current).isAfterOrEqualTo(next);
        }
    }

    private ChatLog createChatLog(Long userId, String question, String response) {
        return ChatLog.builder()
                .userId(userId)
                .userQuestion(question)
                .botResponse(response)
                .confidenceScore(BigDecimal.valueOf(0.85))
                .retrievedChunks(3)
                .questionTimestamp(LocalDateTime.now())
                .responseTimestamp(LocalDateTime.now().plusSeconds(2))
                .build();
    }
}
