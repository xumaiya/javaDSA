package com.dsaplatform.service;

import com.dsaplatform.config.RateLimitProperties;
import com.dsaplatform.dto.response.RateLimitInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

/**
 * Service for implementing sliding window rate limiting using in-memory storage.
 * 
 * Requirements: 5.1, 5.2, 5.3
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RateLimitService {

    private final RateLimitProperties rateLimitProperties;
    
    // In-memory storage: userId -> queue of request timestamps
    private final Map<Long, Queue<Long>> requestTimestamps = new ConcurrentHashMap<>();

    public RateLimitInfo checkAndRecordRequest(Long userId) {
        if (!rateLimitProperties.isEnabled()) {
            log.debug("Rate limiting is disabled");
            return RateLimitInfo.builder()
                    .allowed(true)
                    .remainingRequests(rateLimitProperties.getRequestsPerMinute())
                    .resetTimeSeconds(0)
                    .limit(rateLimitProperties.getRequestsPerMinute())
                    .build();
        }

        long currentTimeMillis = Instant.now().toEpochMilli();
        long windowStartMillis = currentTimeMillis - (rateLimitProperties.getWindowSizeSeconds() * 1000L);

        Queue<Long> timestamps = requestTimestamps.computeIfAbsent(userId, k -> new ConcurrentLinkedQueue<>());
        
        while (!timestamps.isEmpty() && timestamps.peek() < windowStartMillis) {
            timestamps.poll();
        }

        int requestCount = timestamps.size();
        int limit = rateLimitProperties.getRequestsPerMinute();
        int remainingRequests = Math.max(0, limit - requestCount);
        
        long resetTimeSeconds = calculateResetTime(timestamps, currentTimeMillis);

        if (requestCount >= limit) {
            log.warn("Rate limit exceeded for user {}: {} requests in window", userId, requestCount);
            return RateLimitInfo.builder()
                    .allowed(false)
                    .remainingRequests(0)
                    .resetTimeSeconds(resetTimeSeconds)
                    .limit(limit)
                    .build();
        }

        timestamps.add(currentTimeMillis);

        log.debug("Rate limit check for user {}: {}/{} requests used", 
                userId, requestCount + 1, limit);

        return RateLimitInfo.builder()
                .allowed(true)
                .remainingRequests(remainingRequests - 1)
                .resetTimeSeconds(resetTimeSeconds)
                .limit(limit)
                .build();
    }

    public RateLimitInfo getRateLimitStatus(Long userId) {
        if (!rateLimitProperties.isEnabled()) {
            return RateLimitInfo.builder()
                    .allowed(true)
                    .remainingRequests(rateLimitProperties.getRequestsPerMinute())
                    .resetTimeSeconds(0)
                    .limit(rateLimitProperties.getRequestsPerMinute())
                    .build();
        }

        long currentTimeMillis = Instant.now().toEpochMilli();
        long windowStartMillis = currentTimeMillis - (rateLimitProperties.getWindowSizeSeconds() * 1000L);

        Queue<Long> timestamps = requestTimestamps.get(userId);
        
        if (timestamps == null) {
            return RateLimitInfo.builder()
                    .allowed(true)
                    .remainingRequests(rateLimitProperties.getRequestsPerMinute())
                    .resetTimeSeconds(0)
                    .limit(rateLimitProperties.getRequestsPerMinute())
                    .build();
        }

        while (!timestamps.isEmpty() && timestamps.peek() < windowStartMillis) {
            timestamps.poll();
        }

        int requestCount = timestamps.size();
        int limit = rateLimitProperties.getRequestsPerMinute();
        int remainingRequests = Math.max(0, limit - requestCount);
        long resetTimeSeconds = calculateResetTime(timestamps, currentTimeMillis);

        return RateLimitInfo.builder()
                .allowed(requestCount < limit)
                .remainingRequests(remainingRequests)
                .resetTimeSeconds(resetTimeSeconds)
                .limit(limit)
                .build();
    }

    private long calculateResetTime(Queue<Long> timestamps, long currentTimeMillis) {
        if (timestamps == null || timestamps.isEmpty()) {
            return 0;
        }
        
        Long oldestTimestamp = timestamps.peek();
        if (oldestTimestamp != null) {
            long windowEndMillis = oldestTimestamp + (rateLimitProperties.getWindowSizeSeconds() * 1000L);
            long resetTimeMillis = windowEndMillis - currentTimeMillis;
            return Math.max(0, resetTimeMillis / 1000);
        }
        
        return rateLimitProperties.getWindowSizeSeconds();
    }

    public void resetRateLimit(Long userId) {
        requestTimestamps.remove(userId);
        log.info("Reset rate limit for user {}", userId);
    }
    
    public void clearAll() {
        requestTimestamps.clear();
        log.info("Cleared all rate limit data");
    }
}
