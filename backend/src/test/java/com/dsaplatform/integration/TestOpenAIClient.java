package com.dsaplatform.integration;

import com.dsaplatform.config.OpenAIProperties;
import com.dsaplatform.service.OpenAIClient;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

/**
 * Test implementation of OpenAIClient that returns mock responses.
 * Used for integration testing without calling the actual OpenAI API.
 */
public class TestOpenAIClient extends OpenAIClient {

    public TestOpenAIClient(WebClient.Builder webClientBuilder, OpenAIProperties properties) {
        super(webClientBuilder, properties);
    }

    @Override
    public List<double[]> createEmbeddings(List<String> texts) {
        // Return mock embeddings - 1536 dimensions for OpenAI ada-002
        double[] mockEmbedding = new double[1536];
        for (int i = 0; i < 1536; i++) {
            mockEmbedding[i] = 0.01 * (i % 100);
        }
        return texts.stream()
                .map(t -> mockEmbedding.clone())
                .toList();
    }

    @Override
    public String createChatCompletion(String systemPrompt, String userMessage) {
        return "Arrays are fundamental data structures that store elements in contiguous memory locations. " +
                "They provide constant-time O(1) access to elements by index.";
    }
}
