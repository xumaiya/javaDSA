package com.dsaplatform.service;

import com.dsaplatform.dto.response.QuizResponse;
import com.dsaplatform.exception.OpenAIException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Service for generating quiz questions dynamically using LLM.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class QuizGenerationService {
    
    private final OpenAIClient openAIClient;
    private final ObjectMapper objectMapper;
    
    private static final String SYSTEM_PROMPT = """
        You are an expert DSA (Data Structures and Algorithms) educator creating quiz questions 
        for Java learners. Your questions should test understanding of concepts, not just memorization.
        
        You MUST respond with ONLY valid JSON in the exact format specified, with no additional text 
        before or after the JSON.
        """;
    
    /**
     * Generate quiz questions based on topic and difficulty.
     * 
     * @param topic The DSA topic (e.g., "Arrays", "Linked Lists", "Stacks")
     * @param difficulty The difficulty level (beginner, intermediate, advanced)
     * @param questionCount Number of questions to generate (3-10)
     * @return QuizResponse with generated questions
     */
    public QuizResponse generateQuiz(String topic, String difficulty, int questionCount) {
        log.info("Generating {} {} level questions for topic: {}", questionCount, difficulty, topic);
        
        try {
            // Generate questions using LLM
            String llmResponse = generateQuestionsWithLLM(topic, difficulty, questionCount);
            
            // Parse LLM response
            List<QuizResponse.QuizQuestionDto> questions = parseLLMResponse(llmResponse, topic);
            
            // Ensure we have the requested number of questions
            if (questions.size() < questionCount) {
                log.warn("Generated only {} questions instead of requested {}", 
                        questions.size(), questionCount);
            }
            
            log.info("Successfully generated {} questions for {}", questions.size(), topic);
            
            return QuizResponse.builder()
                    .topic(topic)
                    .difficulty(difficulty)
                    .questions(questions)
                    .generatedAt(LocalDateTime.now())
                    .build();
            
        } catch (OpenAIException e) {
            log.error("Failed to generate quiz using LLM for topic: {}", topic, e);
            throw new OpenAIException("Failed to generate quiz: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error generating quiz for topic: {}", topic, e);
            throw new RuntimeException("Failed to generate quiz: " + e.getMessage(), e);
        }
    }
    
    /**
     * Generate quiz questions using OpenRouter LLM.
     */
    private String generateQuestionsWithLLM(String topic, String difficulty, int count) {
        String userPrompt = buildQuizPrompt(topic, difficulty, count);
        
        log.debug("Sending quiz generation request to LLM");
        String response = openAIClient.createChatCompletion(SYSTEM_PROMPT, userPrompt);
        log.debug("Received LLM response");
        
        return response;
    }
    
    /**
     * Build the prompt for LLM quiz generation.
     */
    private String buildQuizPrompt(String topic, String difficulty, int count) {
        String difficultyGuidance = getDifficultyGuidance(difficulty);
        
        return String.format("""
            Generate %d multiple-choice quiz questions about %s in Java for %s level students.
            
            CRITICAL: Respond with ONLY valid JSON. No markdown, no extra text. Just pure JSON.
            
            Format:
            {"questions":[{"question":"Q1?","options":["A","B","C","D"],"correctAnswer":0,"explanation":"Why A is correct"},{"question":"Q2?","options":["A","B","C","D"],"correctAnswer":1,"explanation":"Why B is correct"}]}
            
            Requirements:
            - Generate exactly %d questions about %s in Java
            - Each question: 4 options, correctAnswer (0-3), brief explanation
            - %s level difficulty: %s
            - Keep explanations under 50 words
            - Use compact JSON format
            
            Generate now:
            """, 
            count, topic, difficulty,
            count, topic, difficulty, difficultyGuidance);
    }
    
    /**
     * Get difficulty-specific guidance for question generation.
     */
    private String getDifficultyGuidance(String difficulty) {
        return switch (difficulty.toLowerCase()) {
            case "beginner" -> 
                "Focus on basic concepts, definitions, and simple operations. " +
                "Use ELI10 (Explain Like I'm 10) style with relatable analogies. " +
                "Questions should test fundamental understanding.";
            case "intermediate" -> 
                "Include implementation details, time/space complexity, and common operations. " +
                "Questions should test practical application and problem-solving. " +
                "May include code snippets and algorithm analysis.";
            case "advanced" -> 
                "Cover complex scenarios, optimization techniques, and edge cases. " +
                "Questions should test deep understanding and advanced problem-solving. " +
                "Include algorithmic challenges and performance considerations.";
            default -> "Test general understanding of the topic.";
        };
    }
    
    /**
     * Parse LLM JSON response into quiz questions.
     */
    private List<QuizResponse.QuizQuestionDto> parseLLMResponse(String llmResponse, String topic) {
        try {
            log.info("📥 Parsing LLM response (length: {} chars)", llmResponse.length());
            log.debug("📄 Full LLM response: {}", llmResponse);
            
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
            
            log.info("🧹 Cleaned response (length: {} chars)", cleanedResponse.length());
            
            // Parse JSON
            JsonNode rootNode = objectMapper.readTree(cleanedResponse);
            JsonNode questionsNode = rootNode.path("questions");
            
            if (!questionsNode.isArray()) {
                log.error("❌ Questions node is not an array!");
                throw new IllegalArgumentException("Questions must be an array");
            }
            
            List<QuizResponse.QuizQuestionDto> questions = new ArrayList<>();
            
            for (JsonNode questionNode : questionsNode) {
                // Parse options array
                JsonNode optionsNode = questionNode.path("options");
                List<String> options = new ArrayList<>();
                if (optionsNode.isArray()) {
                    for (JsonNode optionNode : optionsNode) {
                        options.add(optionNode.asText());
                    }
                }
                
                // Validate we have 4 options
                if (options.size() != 4) {
                    log.warn("⚠️ Question has {} options instead of 4, skipping", options.size());
                    continue;
                }
                
                QuizResponse.QuizQuestionDto question = QuizResponse.QuizQuestionDto.builder()
                        .id("q_" + UUID.randomUUID().toString().substring(0, 8))
                        .question(questionNode.path("question").asText())
                        .options(options)
                        .correctAnswer(questionNode.path("correctAnswer").asInt())
                        .explanation(questionNode.path("explanation").asText())
                        .build();
                
                questions.add(question);
                log.info("✅ Parsed question {}: {}", questions.size(), question.getQuestion());
            }
            
            if (questions.isEmpty()) {
                log.error("❌ No valid questions found in LLM response!");
                throw new IllegalArgumentException("No valid questions found in LLM response");
            }
            
            log.info("🎉 Successfully parsed {} questions from LLM response", questions.size());
            return questions;
            
        } catch (JsonProcessingException e) {
            log.error("❌ Failed to parse LLM response as JSON", e);
            log.error("📄 Problematic response: {}", llmResponse);
            throw new IllegalArgumentException("Invalid JSON response from LLM: " + e.getMessage(), e);
        }
    }
}
