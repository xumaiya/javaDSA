package com.dsaplatform.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration properties for rate limiting.
 * 
 * Requirements: 5.2, 5.3
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "rate-limit")
public class RateLimitProperties {
    
    /**
     * Maximum number of requests allowed per minute per user.
     * Default: 10
     */
    private int requestsPerMinute = 10;
    
    /**
     * Whether rate limiting is enabled.
     * Default: true
     */
    private boolean enabled = true;
    
    /**
     * Time window in seconds for rate limiting.
     * Default: 60 (1 minute)
     */
    private int windowSizeSeconds = 60;
}
