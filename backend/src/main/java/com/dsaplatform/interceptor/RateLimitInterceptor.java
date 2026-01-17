package com.dsaplatform.interceptor;

import com.dsaplatform.config.RateLimitProperties;
import com.dsaplatform.dto.response.RateLimitInfo;
import com.dsaplatform.exception.RateLimitExceededException;
import com.dsaplatform.service.RateLimitService;
import com.dsaplatform.util.SecurityUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * Interceptor that enforces rate limiting on chat endpoints.
 * 
 * Checks rate limit before processing request and adds retry-after header on 429 response.
 * 
 * Requirements: 5.1
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class RateLimitInterceptor implements HandlerInterceptor {

    private final RateLimitService rateLimitService;
    private final RateLimitProperties rateLimitProperties;
    private final SecurityUtil securityUtil;

    private static final String HEADER_RETRY_AFTER = "Retry-After";
    private static final String HEADER_RATE_LIMIT_LIMIT = "X-RateLimit-Limit";
    private static final String HEADER_RATE_LIMIT_REMAINING = "X-RateLimit-Remaining";
    private static final String HEADER_RATE_LIMIT_RESET = "X-RateLimit-Reset";

    @Override
    public boolean preHandle(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull Object handler) throws Exception {

        // Skip if rate limiting is disabled
        if (!rateLimitProperties.isEnabled()) {
            log.debug("Rate limiting is disabled, allowing request");
            return true;
        }

        // Get authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = securityUtil.getUserId(authentication);

        if (userId == null) {
            // No authenticated user - let the security filter handle it
            log.debug("No authenticated user found, skipping rate limit check");
            return true;
        }

        // Check rate limit
        RateLimitInfo rateLimitInfo = rateLimitService.checkAndRecordRequest(userId);

        // Add rate limit headers to response
        addRateLimitHeaders(response, rateLimitInfo);

        if (!rateLimitInfo.isAllowed()) {
            log.warn("Rate limit exceeded for user {}, returning 429", userId);
            
            // Add Retry-After header (Requirements: 5.1)
            response.setHeader(HEADER_RETRY_AFTER, String.valueOf(rateLimitInfo.getResetTimeSeconds()));
            
            throw new RateLimitExceededException(
                    rateLimitInfo.getResetTimeSeconds(),
                    rateLimitInfo.getLimit()
            );
        }

        log.debug("Rate limit check passed for user {}: {}/{} remaining",
                userId, rateLimitInfo.getRemainingRequests(), rateLimitInfo.getLimit());

        return true;
    }

    /**
     * Adds standard rate limit headers to the response.
     */
    private void addRateLimitHeaders(HttpServletResponse response, RateLimitInfo rateLimitInfo) {
        response.setHeader(HEADER_RATE_LIMIT_LIMIT, String.valueOf(rateLimitInfo.getLimit()));
        response.setHeader(HEADER_RATE_LIMIT_REMAINING, String.valueOf(rateLimitInfo.getRemainingRequests()));
        response.setHeader(HEADER_RATE_LIMIT_RESET, String.valueOf(rateLimitInfo.getResetTimeSeconds()));
    }
}
