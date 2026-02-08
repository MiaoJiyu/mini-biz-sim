package com.financelab.mallservice;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MallServiceApplication {

    public static void main(String[] args) {
        // Load .env file from project root
        loadEnv();
        SpringApplication.run(MallServiceApplication.class, args);
    }

    private static void loadEnv() {
        try {
            String projectRoot = System.getProperty("user.dir").replace("/backend/mall-service", "");
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
