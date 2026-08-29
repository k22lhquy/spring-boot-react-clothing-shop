package com.shop.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final int GENERAL_LIMIT = 60; // Max requests per minute
    private static final int SENSITIVE_LIMIT = 10; // Max requests per minute for auth/checkout
    private static final long TIME_WINDOW_MS = 60_000; // 1 minute window

    private final Map<String, ClientRateState> clientStateMap = new ConcurrentHashMap<>();

    private static class ClientRateState {
        long windowStartTimestamp;
        int generalRequestCount;
        int sensitiveRequestCount;

        ClientRateState(long startTimestamp) {
            this.windowStartTimestamp = startTimestamp;
            this.generalRequestCount = 0;
            this.sensitiveRequestCount = 0;
        }

        synchronized void resetIfExpired(long now) {
            if (now - windowStartTimestamp > TIME_WINDOW_MS) {
                this.windowStartTimestamp = now;
                this.generalRequestCount = 0;
                this.sensitiveRequestCount = 0;
            }
        }
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Skip static resources or OPTIONS preflight requests
        if (request.getMethod().equalsIgnoreCase("OPTIONS") || path.startsWith("/static/") || path.endsWith(".ico")) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientIp = getClientIp(request);
        long currentTime = System.currentTimeMillis();

        ClientRateState state = clientStateMap.computeIfAbsent(clientIp, k -> new ClientRateState(currentTime));
        state.resetIfExpired(currentTime);

        boolean isSensitiveEndpoint = path.contains("/api/auth/login") ||
                                     path.contains("/api/auth/register") ||
                                     path.contains("/api/orders");

        boolean limitExceeded = false;
        int limit = GENERAL_LIMIT;
        int currentCount;

        synchronized (state) {
            if (isSensitiveEndpoint) {
                limit = SENSITIVE_LIMIT;
                state.sensitiveRequestCount++;
                currentCount = state.sensitiveRequestCount;
            } else {
                limit = GENERAL_LIMIT;
                state.generalRequestCount++;
                currentCount = state.generalRequestCount;
            }

            if (currentCount > limit) {
                limitExceeded = true;
            }
        }

        response.setHeader("X-RateLimit-Limit", String.valueOf(limit));
        response.setHeader("X-RateLimit-Remaining", String.valueOf(Math.max(0, limit - currentCount)));

        if (limitExceeded) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.setHeader("Retry-After", "60");
            response.getWriter().write("""
                {
                    "error": "Too Many Requests",
                    "status": 429,
                    "message": "Cảnh báo Anti-DDoS: Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 60 giây.",
                    "retryAfterSeconds": 60
                }
                """);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }
}
