package com.dsaplatform.config;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * Configuration properties for OpenRouter API integration (OpenAI-compatible).
 * Properties are loaded from application.properties/yml with prefix "openai".
 * 
 * Requirements: 4.1, 7.3
 */
@Data
@Validated
@ConfigurationProperties(prefix = "openai")
public class OpenAIProperties {
    
    /**
     * OpenRouter API key. Must be provided via environment variable OPENROUTER_API_KEY.
     */
    @NotBlank(message = "API key must be configured")
    private String apiKey;
    
    /**
     * Model to use for generating embeddings.
     * Default: openai/text-embedding-3-small (via OpenRouter)
     */
    private String embeddingModel = "openai/text-embedding-3-small";
    
    /**
     * Model to use for chat completions.
     * Default: openai/gpt-3.5-turbo (via OpenRouter)
     */
    private String chatModel = "openai/gpt-3.5-turbo";
    
    /**
     * Maximum number of tokens in the response.
     * Default: 3500 (for quiz generation with 4 questions)
     */
    @Min(1)
    @Max(4096)
    private int maxTokens = 3500;
    
    /**
     * Temperature for response generation (0.0 - 2.0).
     * Lower values make output more deterministic.
     * Default: 0.7
     */
    @Min(0)
    @Max(2)
    private double temperature = 0.7;
    
    /**
     * Base URL for OpenRouter API (OpenAI-compatible).
     * Default: https://openrouter.ai/api/v1
     */
    private String baseUrl = "https://openrouter.ai/api/v1";
    
    /**
     * Connection timeout in milliseconds.
     * Default: 30000 (30 seconds)
     */
    private int connectionTimeout = 30000;
    
    /**
     * Read timeout in milliseconds.
     * Default: 60000 (60 seconds)
     */
    private int readTimeout = 60000;
    
    /**
     * Returns a masked version of the API key for logging purposes.
     * Shows only the first 4 and last 4 characters.
     */
    public String getMaskedApiKey() {
        if (apiKey == null || apiKey.length() < 12) {
            return "****";
        }
        return apiKey.substring(0, 4) + "..." + apiKey.substring(apiKey.length() - 4);
    }
}
