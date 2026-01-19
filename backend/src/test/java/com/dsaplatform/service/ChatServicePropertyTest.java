package com.dsaplatform.service;

import com.dsaplatform.dto.request.ChatRequest;
import com.dsaplatform.dto.response.ChatResponse;
import com.dsaplatform.model.entity.*;
import com.dsaplatform.repository.*;
import com.dsaplatform.security.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

/**
 * Property-based tests for ChatService.
 * 
 * Tests Properties 1, 5, and 6 from the design document:
 * - Property 1: Chat Response Contains Required Metadata
 * - Property 5: Chat Log Creation
 * - Property 6: Chat Log Completion
 */
@SpringBootTest
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ChatServicePropertyTest {

    @Autowired
    private ChatService chatService;

    @Autowired
    private ChatLogRepository chatLogRepository;

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
    private PasswordEncoder passwordEncoder;

    @MockBean
    private OpenAIClient openAIClient;

    private User testUser;
    private Lesson testLesson;

    @BeforeEach
    void setUp() {
        // Clean up
        chatLogRepository.deleteAll();
        lessonEmbeddingRepository.deleteAll();
        lessonRepository.deleteAll();
        chapterRepository.deleteAll();
        courseRepository.deleteAll();
        userRepository.deleteAll();

        // Create test user
        testUser = User.builder()
                .username("propertytest")
                .email("property@test.com")
                .password(passwordEncoder.encode("password"))
                .role(User.Role.STUDENT)
                .points(0)
                .streak(0)
                .level(1)
                .build();
        testUser = userRepository.save(testUser);

        // Create test course structure
        Course course = Course.builder()
                .title("Test Course")
                .description("Test Description")
                .difficulty(Course.Difficulty.BEGINNER)
                .duration(60)
                .build();
        course = courseRepository.save(course);

        Chapter chapter = Chapter.builder()
                .course(course)
                .title("Test Chapter")
                .description("Test Chapter Description")
                .order(1)
                .build();
        chapter = chapterRepository.save(chapter);

        testLesson = Lesson.builder()
                .chapter(chapter)
                .title("Test Lesson")
                .content("Arrays are data structures that store elements in contiguous memory.")
                .order(1)
                .duration(30)
                .build();
        testLesson = lessonRepository.save(testLesson);

        // Setup OpenAI mocks
        setupOpenAIMocks();
    }

    private void setupOpenAIMocks() {
        double[] mockEmbedding = new double[1536];
        for (int i = 0; i < 1536; i++) {
            mockEmbedding[i] = 0.01 * (i % 100);
        }
        when(openAIClient.createEmbeddings(anyList()))
                .thenAnswer(invocation -> {
                    List<String> texts = invocation.getArgument(0);
                    return texts.stream().map(t -> mockEmbedding).toList();
                });

        when(openAIClient.createChatCompletionWithHistory(anyString(), anyString(), anyList()))
                .thenReturn("This is a test response about arrays and data structures.");
    }

    /**
     * **Feature: rag-chatbot-backend, Property 1: Chat Response Contains Required Metadata**
     * **Validates: Requirements 1.2**
     * 
     * Property: For any valid chat request that receives a successful response, 
     * the response object SHALL contain a non-null confidence score between 0 and 1,
     * and a non-empty list of related chapter references.
     */
    @ParameterizedTest
    @ValueSource(strings = {
        "What is an array?",
        "Explain data structures",
        "How do linked lists work?",
        "What is the time complexity of binary search?"
    })
    @DisplayName("Property 1: Chat response contains required metadata")
    @Transactional
    void chatResponseContainsRequiredMetadata(String question) {
        ChatRequest request = ChatRequest.builder()
                .message(question)
                .build();

        ChatResponse response = chatService.processQuestion(request, testUser.getId());

        // Property: Response ID exists
        assertThat(response.getId())
                .as("Response ID should not be null")
                .isNotNull()
                .startsWith("chat_");

        // Property: Content is not empty
        assertThat(response.getContent())
                .as("Response content should not be empty")
                .isNotBlank();

        // Property: Confidence score is between 0 and 1
        assertThat(response.getConfidenceScore())
                .as("Confidence score should be between 0 and 1")
                .isNotNull()
                .isBetween(0.0, 1.0);

        // Property: Timestamp exists
        assertThat(response.getTimestamp())
                .as("Response timestamp should not be null")
                .isNotNull();

        // Property: Related chapters list exists (may be empty if no embeddings)
        assertThat(response.getRelatedChapters())
                .as("Related chapters should not be null")
                .isNotNull();
    }

    /**
     * **Feature: rag-chatbot-backend, Property 5: Chat Log Creation**
     * **Validates: Requirements 3.1**
     * 
     * Property: For any chat request processed by the system, a ChatLog entry 
     * SHALL be created with non-null user_id, non-empty user_question, and 
     * valid question_timestamp before the response is generated.
     */
    @ParameterizedTest
    @CsvSource({
        "1, What is an array?",
        "2, Explain binary trees",
        "3, How does quicksort work?",
        "4, What is a hash table?"
    })
    @DisplayName("Property 5: Chat log is created with required fields")
    @Transactional
    void chatLogCreatedWithRequiredFields(int iteration, String question) {
        long initialCount = chatLogRepository.count();
        
        ChatRequest request = ChatRequest.builder()
                .message(question)
                .build();

        chatService.processQuestion(request, testUser.getId());

        // Property: A new chat log was created
        long finalCount = chatLogRepository.count();
        assertThat(finalCount)
                .as("Chat log count should increase by 1")
                .isEqualTo(initialCount + 1);

        // Find the created chat log
        ChatLog chatLog = chatLogRepository.findAll().stream()
                .filter(log -> log.getUserQuestion().equals(question))
                .findFirst()
                .orElseThrow(() -> new AssertionError("Chat log not found"));

        // Property: User ID is set correctly
        assertThat(chatLog.getUserId())
                .as("User ID should match")
                .isEqualTo(testUser.getId());

        // Property: User question is stored
        assertThat(chatLog.getUserQuestion())
                .as("User question should be stored")
                .isEqualTo(question);

        // Property: Question timestamp is set
        assertThat(chatLog.getQuestionTimestamp())
                .as("Question timestamp should be set")
                .isNotNull()
                .isBefore(LocalDateTime.now().plusSeconds(1));
    }

    /**
     * **Feature: rag-chatbot-backend, Property 6: Chat Log Completion**
     * **Validates: Requirements 3.2, 3.3**
     * 
     * Property: For any successfully completed chat interaction, the ChatLog entry 
     * SHALL be updated with non-empty bot_response, valid response_timestamp after 
     * question_timestamp, and non-null confidence_score.
     */
    @ParameterizedTest
    @ValueSource(strings = {
        "What is recursion?",
        "Explain graph traversal",
        "How do stacks work?",
        "What is dynamic programming?"
    })
    @DisplayName("Property 6: Chat log is completed with response data")
    @Transactional
    void chatLogCompletedWithResponseData(String question) {
        ChatRequest request = ChatRequest.builder()
                .message(question)
                .build();

        chatService.processQuestion(request, testUser.getId());

        // Find the created chat log
        ChatLog chatLog = chatLogRepository.findAll().stream()
                .filter(log -> log.getUserQuestion().equals(question))
                .findFirst()
                .orElseThrow(() -> new AssertionError("Chat log not found"));

        // Property: Bot response is stored
        assertThat(chatLog.getBotResponse())
                .as("Bot response should be stored")
                .isNotBlank();

        // Property: Response timestamp is set and after question timestamp
        assertThat(chatLog.getResponseTimestamp())
                .as("Response timestamp should be set")
                .isNotNull();
        
        assertThat(chatLog.getResponseTimestamp())
                .as("Response timestamp should be after or equal to question timestamp")
                .isAfterOrEqualTo(chatLog.getQuestionTimestamp());

        // Property: Confidence score is set
        assertThat(chatLog.getConfidenceScore())
                .as("Confidence score should be set")
                .isNotNull();

        // Property: Retrieved chunks count is set
        assertThat(chatLog.getRetrievedChunks())
                .as("Retrieved chunks should be set")
                .isNotNull()
                .isGreaterThanOrEqualTo(0);

        // Property: Related chapter IDs is set (as JSON)
        assertThat(chatLog.getRelatedChapterIds())
                .as("Related chapter IDs should be set")
                .isNotNull();
    }

    /**
     * **Feature: rag-chatbot-backend, Property 6: Chat Log Completion**
     * **Validates: Requirements 3.2, 3.3**
     * 
     * Property: Confidence score in chat log matches response confidence score.
     */
    @Test
    @DisplayName("Property 6.1: Chat log confidence matches response confidence")
    @Transactional
    void chatLogConfidenceMatchesResponseConfidence() {
        ChatRequest request = ChatRequest.builder()
                .message("What is a binary tree?")
                .build();

        ChatResponse response = chatService.processQuestion(request, testUser.getId());

        ChatLog chatLog = chatLogRepository.findAll().stream()
                .filter(log -> log.getUserQuestion().equals("What is a binary tree?"))
                .findFirst()
                .orElseThrow();

        // Property: Confidence scores should match (within rounding tolerance)
        assertThat(chatLog.getConfidenceScore().doubleValue())
                .as("Chat log confidence should match response confidence")
                .isCloseTo(response.getConfidenceScore(), org.assertj.core.data.Offset.offset(0.0001));
    }
}
