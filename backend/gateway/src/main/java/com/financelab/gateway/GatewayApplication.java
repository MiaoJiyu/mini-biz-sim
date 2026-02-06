package com.financelab.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class GatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("user-service", r -> r
                        .path("/api/users/**")
                        .filters(f -> f
                                .stripPrefix(2)
                                .addRequestHeader("X-Gateway", "FinanceLab-Gateway"))
                        .uri("lb://user-service"))

                .route("stock-service", r -> r
                        .path("/api/stocks/**")
                        .filters(f -> f
                                .stripPrefix(2)
                                .addRequestHeader("X-Gateway", "FinanceLab-Gateway"))
                        .uri("lb://stock-service"))

                .route("real-estate-service", r -> r
                        .path("/api/real-estate/**")
                        .filters(f -> f
                                .stripPrefix(2)
                                .addRequestHeader("X-Gateway", "FinanceLab-Gateway"))
                        .uri("lb://real-estate-service"))

                .route("bank-service", r -> r
                        .path("/api/bank/**")
                        .filters(f -> f
                                .stripPrefix(2)
                                .addRequestHeader("X-Gateway", "FinanceLab-Gateway"))
                        .uri("lb://bank-service"))

                .route("mall-service", r -> r
                        .path("/api/mall/**")
                        .filters(f -> f
                                .stripPrefix(2)
                                .addRequestHeader("X-Gateway", "FinanceLab-Gateway"))
                        .uri("lb://mall-service"))

                .route("event-service", r -> r
                        .path("/api/events/**")
                        .filters(f -> f
                                .stripPrefix(2)
                                .addRequestHeader("X-Gateway", "FinanceLab-Gateway"))
                        .uri("lb://event-service"))

                .build();
    }
}
