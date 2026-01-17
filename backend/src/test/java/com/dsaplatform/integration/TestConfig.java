package com.dsaplatform.integration;

import com.dsaplatform.config.OpenAIProperties;
import com.dsaplatform.service.OpenAIClient;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Test configuration that provides mock implementations for integration tests.
 */
@TestConfiguration
public class TestConfig {

    @Bean
    @Primary
    public OpenAIClient testOpenAIClient(WebClient.Builder webClientBuilder, OpenAIProperties properties) {
        return new TestOpenAIClient(webClientBuilder, properties);
    }
}
