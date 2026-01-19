package com.dsaplatform.integration;

import com.dsaplatform.dto.request.ChatRequest;
import com.dsaplatform.dto.request.EmbedContentRequest;
import com.dsaplatform.dto.response.ApiResponse;
import com.dsaplatform.dto.response.ChatResponse;
import com.dsaplatform.dto.response.EmbedResponse;
import com.dsaplatform.model.entity.*;
import com.dsaplatform.repository.*;
import com.dsaplatform.security.JwtService;
import com.dsaplatform.service.OpenAIClient;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * End-to-end integration tests for the RAG chatbot functionality.
 * Tests content embedding flow, question answering flow, and chat history retrieval.
 * 
 * Requirements: 1.1, 2.1, 3.1
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ChatIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ChapterRepository chapterRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private LessonEmbeddingRepository lessonEmbeddingRepository;

    @Autowired
    private ChatLogRepository chatLogRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @MockBean
    private OpenAIClient openAIClient;

    private User testUser;
    private Course testCourse;
    private Chapter testChapter;
    private Lesson testLesson;
    private String authToken;

    @BeforeEach
    void setUp() {
        // Clean up existing data
        chatLogRepository.deleteAll();
        lessonEmbeddingRepository.deleteAll();
        lessonRepository.deleteAll();
        chapterRepository.deleteAll();
        courseRepository.deleteAll();
        userRepository.deleteAll();

        // Create test user
        testUser = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password(passwordEncoder.encode("password123"))
                .role(User.Role.STUDENT)
                .points(0)
                .streak(0)
                .level(1)
                .build();
        testUser = userRepository.save(testUser);

        // Generate JWT token for authentication
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", testUser.getId());
        claims.put("role", testUser.getRole().name());
        authToken = jwtService.generateToken(testUser.getEmail(), claims);

        // Create test course
        testCourse = Course.builder()
                .title("Data Structures 101")
                .description("Introduction to Data Structures")
                .difficulty(Course.Difficulty.BEGINNER)
                .duration(120)
                .build();
        testCourse = courseRepository.save(testCourse);

        // Create test chapter
        testChapter = Chapter.builder()
                .course(testCourse)
                .title("Arrays and Lists")
                .description("Learn about arrays and linked lists")
                .order(1)
                .build();
        testChapter = chapterRepository.save(testChapter);

        // Create test lesson with content
        testLesson = Lesson.builder()
                .chapter(testChapter)
                .title("Introduction to Arrays")
                .content("An array is a collection of elements stored at contiguous memory locations. " +
                        "Arrays provide O(1) access time for elements by index. " +
                        "The main operations on arrays include insertion, deletion, and traversal. " +
                        "Arrays have a fixed size in most programming languages.")
                .order(1)
                .duration(30)
                .build();
        testLesson = lessonRepository.save(testLesson);

        // Mock OpenAI client responses
        setupOpenAIMocks();
    }

    private void setupOpenAIMocks() {
        // Mock embedding generation - return a 1536-dimension vector
        double[] mockEmbedding = new double[1536];
        for (int i = 0; i < 1536; i++) {
            mockEmbedding[i] = 0.01 * (i % 100);
        }
        when(openAIClient.createEmbeddings(anyList()))
                .thenAnswer(invocation -> {
                    List<String> texts = invocation.getArgument(0);
                    return texts.stream()
                            .map(t -> mockEmbedding)
                            .toList();
                });

        // Mock chat completion with history
        when(openAIClient.createChatCompletionWithHistory(anyString(), anyString(), anyList()))
                .thenReturn("Arrays are fundamental data structures that store elements in contiguous memory locations. " +
                        "They provide constant-time O(1) access to elements by index.");
    }


    /**
     * Test 1: Content Embedding Flow
     * Verifies that lesson content can be embedded and stored in the database.
     * 
     * Requirements: 2.1
     */
    @Test
    @Order(1)
    void testContentEmbeddingFlow() throws Exception {
        // Given: A lesson with content exists
        EmbedContentRequest request = EmbedContentRequest.builder()
                .lessonId(testLesson.getId())
                .chunkSize(100)
                .chunkOverlap(20)
                .build();

        // When: We call the embed-content endpoint
        MvcResult result = mockMvc.perform(post("/api/chat/embed-content")
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.lessonId").value(testLesson.getId()))
                .andExpect(jsonPath("$.data.status").value("SUCCESS"))
                .andExpect(jsonPath("$.data.chunksCreated").isNumber())
                .andReturn();

        // Then: Embeddings should be stored in the database
        List<LessonEmbedding> embeddings = lessonEmbeddingRepository
                .findByLessonIdOrderByChunkIndexAsc(testLesson.getId());
        
        assertThat(embeddings).isNotEmpty();
        assertThat(embeddings).allSatisfy(embedding -> {
            assertThat(embedding.getLesson().getId()).isEqualTo(testLesson.getId());
            assertThat(embedding.getChunkText()).isNotBlank();
            assertThat(embedding.getEmbedding()).isNotBlank();
            assertThat(embedding.getChunkIndex()).isNotNull();
        });

        // Verify chunk indices are sequential
        for (int i = 0; i < embeddings.size(); i++) {
            assertThat(embeddings.get(i).getChunkIndex()).isEqualTo(i);
        }
    }

    /**
     * Test 2: Question Answering Flow
     * Verifies that users can ask questions and receive AI-generated responses.
     * 
     * Requirements: 1.1
     */
    @Test
    @Order(2)
    void testQuestionAnsweringFlow() throws Exception {
        // Given: A user question
        ChatRequest request = ChatRequest.builder()
                .message("What is an array and how does it work?")
                .build();

        // When: We call the ask endpoint
        MvcResult result = mockMvc.perform(post("/api/chat/ask")
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").exists())
                .andExpect(jsonPath("$.data.content").isNotEmpty())
                .andExpect(jsonPath("$.data.confidenceScore").isNumber())
                .andExpect(jsonPath("$.data.timestamp").exists())
                .andReturn();

        // Then: A chat log should be created in the database
        List<ChatLog> chatLogs = chatLogRepository.findAll();
        assertThat(chatLogs).isNotEmpty();
        
        ChatLog latestLog = chatLogs.get(chatLogs.size() - 1);
        assertThat(latestLog.getUserId()).isEqualTo(testUser.getId());
        assertThat(latestLog.getUserQuestion()).isEqualTo("What is an array and how does it work?");
        assertThat(latestLog.getBotResponse()).isNotBlank();
        assertThat(latestLog.getQuestionTimestamp()).isNotNull();
        assertThat(latestLog.getResponseTimestamp()).isNotNull();
        assertThat(latestLog.getConfidenceScore()).isNotNull();
    }

    /**
     * Test 3: Chat History Retrieval
     * Verifies that users can retrieve their chat history with pagination.
     * 
     * Requirements: 3.4
     */
    @Test
    @Order(3)
    void testChatHistoryRetrieval() throws Exception {
        // Given: Create some chat logs for the user
        createTestChatLogs(5);

        // When: We call the history endpoint
        MvcResult result = mockMvc.perform(get("/api/chat/history")
                        .header("Authorization", "Bearer " + authToken)
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.totalElements").value(5))
                .andReturn();

        // Then: All chat logs should belong to the test user
        String responseBody = result.getResponse().getContentAsString();
        assertThat(responseBody).contains("\"userId\":" + testUser.getId());
    }

    /**
     * Test 4: Verify Database State After Embedding
     * Ensures that re-embedding replaces old embeddings (idempotence).
     * 
     * Requirements: 2.4
     */
    @Test
    @Order(4)
    void testReEmbeddingReplacesOldEmbeddings() throws Exception {
        // Given: First embedding
        EmbedContentRequest request = EmbedContentRequest.builder()
                .lessonId(testLesson.getId())
                .chunkSize(100)
                .chunkOverlap(20)
                .build();

        mockMvc.perform(post("/api/chat/embed-content")
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        int firstEmbeddingCount = lessonEmbeddingRepository
                .findByLessonIdOrderByChunkIndexAsc(testLesson.getId()).size();

        // When: Re-embed with different chunk size
        EmbedContentRequest reEmbedRequest = EmbedContentRequest.builder()
                .lessonId(testLesson.getId())
                .chunkSize(200)
                .chunkOverlap(30)
                .build();

        mockMvc.perform(post("/api/chat/embed-content")
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reEmbedRequest)))
                .andExpect(status().isOk());

        // Then: Old embeddings should be replaced
        List<LessonEmbedding> embeddings = lessonEmbeddingRepository
                .findByLessonIdOrderByChunkIndexAsc(testLesson.getId());
        
        // With larger chunk size, we should have fewer chunks
        assertThat(embeddings.size()).isLessThanOrEqualTo(firstEmbeddingCount);
    }

    /**
     * Test 5: Chat Log Creation Before Response
     * Verifies that chat log is created with question timestamp before response.
     * 
     * Requirements: 3.1
     */
    @Test
    @Order(5)
    void testChatLogCreationBeforeResponse() throws Exception {
        // Given: A user question
        ChatRequest request = ChatRequest.builder()
                .message("Explain linked lists")
                .build();

        long initialCount = chatLogRepository.count();

        // When: We call the ask endpoint
        mockMvc.perform(post("/api/chat/ask")
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        // Then: A new chat log should exist
        long finalCount = chatLogRepository.count();
        assertThat(finalCount).isEqualTo(initialCount + 1);

        // Verify the chat log has proper timestamps
        ChatLog chatLog = chatLogRepository.findAll().stream()
                .filter(log -> log.getUserQuestion().equals("Explain linked lists"))
                .findFirst()
                .orElseThrow();

        assertThat(chatLog.getQuestionTimestamp()).isNotNull();
        assertThat(chatLog.getResponseTimestamp()).isNotNull();
        assertThat(chatLog.getResponseTimestamp()).isAfterOrEqualTo(chatLog.getQuestionTimestamp());
    }

    /**
     * Test 6: Input Validation - Empty Message
     * Verifies that empty messages are rejected.
     * 
     * Requirements: 6.1
     */
    @Test
    @Order(6)
    void testInputValidationEmptyMessage() throws Exception {
        ChatRequest request = ChatRequest.builder()
                .message("")
                .build();

        mockMvc.perform(post("/api/chat/ask")
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    /**
     * Test 7: Input Validation - Message Too Long
     * Verifies that messages exceeding 2000 characters are rejected.
     * 
     * Requirements: 6.2
     */
    @Test
    @Order(7)
    void testInputValidationMessageTooLong() throws Exception {
        String longMessage = "a".repeat(2001);
        ChatRequest request = ChatRequest.builder()
                .message(longMessage)
                .build();

        mockMvc.perform(post("/api/chat/ask")
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    /**
     * Test 8: Embed Content - Lesson Not Found
     * Verifies that embedding non-existent lesson returns 404.
     * 
     * Requirements: 6.3
     */
    @Test
    @Order(8)
    void testEmbedContentLessonNotFound() throws Exception {
        EmbedContentRequest request = EmbedContentRequest.builder()
                .lessonId(99999L)
                .build();

        mockMvc.perform(post("/api/chat/embed-content")
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    /**
     * Test 9: Unauthorized Access
     * Verifies that unauthenticated requests are rejected.
     */
    @Test
    @Order(9)
    void testUnauthorizedAccess() throws Exception {
        ChatRequest request = ChatRequest.builder()
                .message("What is an array?")
                .build();

        mockMvc.perform(post("/api/chat/ask")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    /**
     * Helper method to create test chat logs.
     */
    private void createTestChatLogs(int count) {
        for (int i = 0; i < count; i++) {
            ChatLog chatLog = ChatLog.builder()
                    .userId(testUser.getId())
                    .userQuestion("Test question " + i)
                    .botResponse("Test response " + i)
                    .confidenceScore(java.math.BigDecimal.valueOf(0.85))
                    .retrievedChunks(3)
                    .relatedChapterIds("[]")
                    .questionTimestamp(java.time.LocalDateTime.now().minusMinutes(count - i))
                    .responseTimestamp(java.time.LocalDateTime.now().minusMinutes(count - i))
                    .build();
            chatLogRepository.save(chatLog);
        }
    }
}
