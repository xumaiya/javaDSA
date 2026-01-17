package com.dsaplatform.exception;

import lombok.Getter;

/**
 * Exception thrown when a user exceeds the rate limit.
 * 
 * Requirements: 5.1, 8.1
 */
@Getter
public class RateLimitExceededException extends ChatException {
    
    private final long retryAfterSeconds;
    private final int limit;
    
    public RateLimitExceededException(String message, long retryAfterSeconds, int limit) {
        super(message);
        this.retryAfterSeconds = retryAfterSeconds;
        this.limit = limit;
    }
    
    public RateLimitExceededException(long retryAfterSeconds, int limit) {
        this("Rate limit exceeded. Please try again later.", retryAfterSeconds, limit);
    }
}
