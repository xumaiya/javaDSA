package com.dsaplatform.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO containing rate limit status information.
 * 
 * Requirements: 5.1, 5.2
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RateLimitInfo {
    
    /**
     * Whether the request is allowed (under rate limit).
     */
    private boolean allowed;
    
    /**
     * Number of remaining requests in the current window.
     */
    private int remainingRequests;
    
    /**
     * Seconds until the rate limit window resets.
     */
    private long resetTimeSeconds;
    
    /**
     * Maximum requests allowed per window.
     */
    private int limit;
}
