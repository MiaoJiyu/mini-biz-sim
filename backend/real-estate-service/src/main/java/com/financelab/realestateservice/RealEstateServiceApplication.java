package com.financelab.realestateservice;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RealEstateServiceApplication {

    public static void main(String[] args) {
        // Load .env file from project root
        loadEnv();
        SpringApplication.run(RealEstateServiceApplication.class, args);
    }

    private static void loadEnv() {
        try {
            String projectRoot = System.getProperty("user.dir").replace("/backend/real-estate-service", "");
            Dotenv dotenv = Dotenv.configure()
                    .directory(projectRoot)
                    .ignoreIfMissing()
                    .load();

            // Set system properties from .env file
            String dbPassword = dotenv.get("DB_ROOT_PASSWORD");
            if (dbPassword != null) {
                System.setProperty("DB_ROOT_PASSWORD", dbPassword);
            }
            String dbHost = dotenv.get("DB_HOST");
            if (dbHost != null) {
                System.setProperty("DB_HOST", dbHost);
            }
            String dbPort = dotenv.get("DB_PORT");
            if (dbPort != null) {
                System.setProperty("DB_PORT", dbPort);
            }
            String dbUser = dotenv.get("DB_ROOT_USER");
            if (dbUser != null) {
                System.setProperty("DB_ROOT_USER", dbUser);
            }
            String dbName = dotenv.get("DB_NAME_REALESTATE");
            if (dbName != null) {
                System.setProperty("DB_NAME_REALESTATE", dbName);
            }
            String redisHost = dotenv.get("REDIS_HOST");
            if (redisHost != null) {
                System.setProperty("REDIS_HOST", redisHost);
            }
            String redisPort = dotenv.get("REDIS_PORT");
            if (redisPort != null) {
                System.setProperty("REDIS_PORT", redisPort);
            }
            String redisPassword = dotenv.get("REDIS_PASSWORD");
            if (redisPassword != null) {
                System.setProperty("REDIS_PASSWORD", redisPassword);
            }
            String redisDatabase = dotenv.get("REDIS_DATABASE");
            if (redisDatabase != null) {
                System.setProperty("REDIS_DATABASE", redisDatabase);
            }
        } catch (Exception e) {
            System.err.println("Warning: Failed to load .env file: " + e.getMessage());
        }
    }
}