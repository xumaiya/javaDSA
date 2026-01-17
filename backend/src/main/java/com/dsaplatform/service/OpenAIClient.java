package com.dsaplatform.service;

import com.dsaplatform.config.OpenAIProperties;
import com.dsaplatform.exception.OpenAIException;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Client service for interacting with OpenRouter API (OpenAI-compatible).
 * Handles embeddings generation and chat completions.
 * 
 * Requirements: 4.1, 4.2, 8.2
 */
@Service
@Slf4j
public class OpenAIClient {
    
    private final WebClient webClient;
    private final OpenAIProperties properties;
    
    public OpenAIClient(WebClient.Builder webClientBuilder, OpenAIProperties properties) {
        this.properties = properties;
        this.webClient = webClientBuilder
                .baseUrl(properties.getBaseUrl())
                .defaultHeader("Authorization", "Bearer " + properties.getApiKey())
                .defaultHeader("Content-Type", "application/json")
                .defaultHeader("HTTP-Referer", "http://localhost:8080")
                .defaultHeader("X-Title", "DSA Learning Platform")
                .build();
        
        log.info("OpenRouter client initialized with API key: {}", properties.getMaskedApiKey());
        log.info("Using base URL: {}", properties.getBaseUrl());
        validateApiKey();
    }
    
    /**
     * Validates that the API key is configured properly.
     */
    private void validateApiKey() {
        String apiKey = properties.getApiKey();
        if (apiKey == null || apiKey.isBlank() || 
            apiKey.equals("your-openrouter-api-key") ||
            apiKey.equals("your-openai-api-key")) {
            log.warn("API key appears to be invalid or not configured. " +
                    "Set OPENROUTER_API_KEY environment variable with a valid key.");
        }
    }

    /**
     * Creates embeddings for a batch of texts.
     * 
     * @param texts List of texts to embed
     * @return List of embedding vectors
     * @throws OpenAIException if the API call fails
     */
    public List<double[]> createEmbeddings(List<String> texts) {
        if (texts == null || texts.isEmpty()) {
            log.warn("Empty text list provided for embedding generation");
            return List.of();
        }
        
        log.debug("Creating embeddings for {} texts using model: {}", 
                texts.size(), properties.getEmbeddingModel());
        
        EmbeddingRequest request = new EmbeddingRequest();
        request.setModel(properties.getEmbeddingModel());
        request.setInput(texts);
        
        try {
            EmbeddingResponse response = webClient.post()
                    .uri("/embeddings")
                    .bodyValue(request)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, clientResponse -> 
                        clientResponse.bodyToMono(String.class)
                            .flatMap(errorBody -> {
                                log.error("Embedding API error: {}", errorBody);
                                return Mono.error(new OpenAIException(
                                    "Failed to create embeddings: " + errorBody));
                            }))
                    .bodyToMono(EmbeddingResponse.class)
                    .timeout(Duration.ofMillis(properties.getReadTimeout()))
                    .block();
            
            if (response == null || response.getData() == null) {
                throw new OpenAIException("Empty response from embedding API");
            }
            
            List<double[]> embeddings = response.getData().stream()
                    .sorted((a, b) -> Integer.compare(a.getIndex(), b.getIndex()))
                    .map(data -> data.getEmbedding().stream()
                            .mapToDouble(Double::doubleValue)
                            .toArray())
                    .collect(Collectors.toList());
            
            log.debug("Successfully created {} embeddings", embeddings.size());
            return embeddings;
            
        } catch (WebClientResponseException e) {
            log.error("API request failed with status {}: {}", 
                    e.getStatusCode(), e.getResponseBodyAsString());
            throw new OpenAIException("API request failed: " + e.getMessage(), e);
        } catch (OpenAIException e) {
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error calling embedding API", e);
            throw new OpenAIException("Failed to create embeddings: " + e.getMessage(), e);
        }
    }

    /**
     * Creates a chat completion using the configured model.
     * 
     * @param systemPrompt The system prompt to set context
     * @param userMessage The user's message/question
     * @return The assistant's response content
     * @throws OpenAIException if the API call fails
     */
    public String createChatCompletion(String systemPrompt, String userMessage) {
        if (userMessage == null || userMessage.isBlank()) {
            throw new OpenAIException("User message cannot be empty");
        }
        
        log.debug("Creating chat completion using model: {}", properties.getChatModel());
        
        ChatCompletionRequest request = new ChatCompletionRequest();
        request.setModel(properties.getChatModel());
        request.setMaxTokens(properties.getMaxTokens());
        request.setTemperature(properties.getTemperature());
        request.setMessages(List.of(
                new ChatMessage("system", systemPrompt != null ? systemPrompt : "You are a helpful assistant."),
                new ChatMessage("user", userMessage)
        ));
        
        try {
            ChatCompletionResponse response = webClient.post()
                    .uri("/chat/completions")
                    .bodyValue(request)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, clientResponse -> 
                        clientResponse.bodyToMono(String.class)
                            .flatMap(errorBody -> {
                                log.error("Chat API error: {}", errorBody);
                                return Mono.error(new OpenAIException(
                                    "Failed to create chat completion: " + errorBody));
                            }))
                    .bodyToMono(ChatCompletionResponse.class)
                    .timeout(Duration.ofMillis(properties.getReadTimeout()))
                    .block();
            
            if (response == null || response.getChoices() == null || response.getChoices().isEmpty()) {
                throw new OpenAIException("Empty response from chat API");
            }
            
            String content = response.getChoices().get(0).getMessage().getContent();
            log.debug("Successfully received chat completion response");
            return content;
            
        } catch (WebClientResponseException e) {
            log.error("API request failed with status {}: {}", 
                    e.getStatusCode(), e.getResponseBodyAsString());
            throw new OpenAIException("API request failed: " + e.getMessage(), e);
        } catch (OpenAIException e) {
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error calling chat API", e);
            throw new OpenAIException("Failed to create chat completion: " + e.getMessage(), e);
        }
    }

    // ==================== Request/Response DTOs ====================
    
    @Data
    static class EmbeddingRequest {
        private String model;
        private List<String> input;
    }
    
    @Data
    static class EmbeddingResponse {
        private List<EmbeddingData> data;
        private String model;
        private Usage usage;
        
        @Data
        static class EmbeddingData {
            private int index;
            private List<Double> embedding;
            private String object;
        }
        
        @Data
        static class Usage {
            @JsonProperty("prompt_tokens")
            private int promptTokens;
            @JsonProperty("total_tokens")
            private int totalTokens;
        }
    }
    
    @Data
    static class ChatCompletionRequest {
        private String model;
        private List<ChatMessage> messages;
        @JsonProperty("max_tokens")
        private int maxTokens;
        private double temperature;
    }
    
    @Data
    static class ChatMessage {
        private String role;
        private String content;
        
        ChatMessage() {}
        
        ChatMessage(String role, String content) {
            this.role = role;
            this.content = content;
        }
    }
    
    @Data
    static class ChatCompletionResponse {
        private String id;
        private String object;
        private long created;
        private String model;
        private List<Choice> choices;
        private Usage usage;
        
        @Data
        static class Choice {
            private int index;
            private ChatMessage message;
            @JsonProperty("finish_reason")
            private String finishReason;
        }
        
        @Data
        static class Usage {
            @JsonProperty("prompt_tokens")
            private int promptTokens;
            @JsonProperty("completion_tokens")
            private int completionTokens;
            @JsonProperty("total_tokens")
            private int totalTokens;
        }
    }
}
