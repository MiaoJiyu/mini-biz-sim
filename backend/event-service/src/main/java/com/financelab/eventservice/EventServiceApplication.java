package com.financelab.eventservice;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class EventServiceApplication {

    public static void main(String[] args) {
        // Load .env file from project root
        loadEnv();
        SpringApplication.run(EventServiceApplication.class, args);
    }

    private static void loadEnv() {
        try {
            String projectRoot = System.getProperty("user.dir").replace("/backend/event-service", "");
            Dotenv dotenv = Dotenv.configure()
                    .directory(projectRoot)
                    .ignoreIfMissing()
                    .load();

            // Set system properties from .env file
            dotenv.entries().forEach(entry -> {
                System.setProperty(entry.getKey(), entry.getValue());
            });
        } catch (Exception e) {
            System.err.println("Warning: Failed to load .env file: " + e.getMessage());
        }
    }

}
