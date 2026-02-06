package com.financelab.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitFilter extends AbstractGatewayFilterFactory<RateLimitFilter.Config> {

    private static final int DEFAULT_RATE_LIMIT = 100;
    private static final int DEFAULT_TIME_WINDOW = 60;

    private final ConcurrentHashMap<String, RateLimiter> rateLimiters = new ConcurrentHashMap<>();

    public RateLimitFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (ServerWebExchange exchange, GatewayFilterChain chain) -> {
            String clientId = getClientId(exchange);

            RateLimiter limiter = rateLimiters.computeIfAbsent(
                    clientId,
                    key -> new RateLimiter(
                            config.rateLimit != null ? config.rateLimit : DEFAULT_RATE_LIMIT,
                            config.timeWindow != null ? config.timeWindow : DEFAULT_TIME_WINDOW
                    )
            );

            if (!limiter.allowRequest()) {
                ServerHttpResponse response = exchange.getResponse();
                response.setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
                return response.setComplete();
            }

            return chain.filter(exchange);
        };
    }

    private String getClientId(ServerWebExchange exchange) {
        String userId = exchange.getRequest().getHeaders().getFirst("X-User-Id");
        String ip = exchange.getRequest().getRemoteAddress() != null
                ? exchange.getRequest().getRemoteAddress().getAddress().getHostAddress()
                : "unknown";
        return userId != null ? userId : ip;
    }

    public static class Config {
        private Integer rateLimit;
        private Integer timeWindow;

        public Integer getRateLimit() {
            return rateLimit;
        }

        public void setRateLimit(Integer rateLimit) {
            this.rateLimit = rateLimit;
        }

        public Integer getTimeWindow() {
            return timeWindow;
        }

        public void setTimeWindow(Integer timeWindow) {
            this.timeWindow = timeWindow;
        }
    }

    private static class RateLimiter {
        private final int rateLimit;
        private final int timeWindow;
        private final AtomicInteger counter;
        private long lastResetTime;

        public RateLimiter(int rateLimit, int timeWindow) {
            this.rateLimit = rateLimit;
            this.timeWindow = timeWindow * 1000;
            this.counter = new AtomicInteger(0);
            this.lastResetTime = System.currentTimeMillis();
        }

        public boolean allowRequest() {
            long currentTime = System.currentTimeMillis();

            if (currentTime - lastResetTime > timeWindow) {
                counter.set(0);
                lastResetTime = currentTime;
            }

            return counter.incrementAndGet() <= rateLimit;
        }
    }
}
