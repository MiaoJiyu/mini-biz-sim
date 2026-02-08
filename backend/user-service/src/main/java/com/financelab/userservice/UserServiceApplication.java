package com.financelab.userservice;

import io.github.cdimascio.dotenv.Dotenv;
import io.github.cdimascio.dotenv.DotenvException;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;

@SpringBootApplication
public class UserServiceApplication {

    public static void main(String[] args) {
        // 加载 .env 文件
        try {
            File currentDir = new File(System.getProperty("user.dir"));
            // user-service 在 backend 目录下，backend 在项目根目录下
            File projectRoot = currentDir.getParentFile().getParentFile();

            System.out.println("Current dir: " + currentDir.getAbsolutePath());
            System.out.println("Project root: " + projectRoot.getAbsolutePath());

            Dotenv dotenv = Dotenv.configure()
                    .directory(projectRoot.getAbsolutePath())
                    .ignoreIfMalformed()
                    .ignoreIfMissing()
                    .load();

            System.out.println("Dotenv loaded successfully");

            // 将 .env 中的变量设置为系统属性
            dotenv.entries().forEach(entry -> {
                System.setProperty(entry.getKey(), entry.getValue());
                System.out.println("Loaded: " + entry.getKey() + " = " + (entry.getKey().contains("PASSWORD") ? "***" : entry.getValue()));
            });

            // 验证密码是否加载
            System.out.println("DB_ROOT_PASSWORD from system property: " + System.getProperty("DB_ROOT_PASSWORD"));
        } catch (Exception e) {
            System.out.println("Warning: Could not load .env file: " + e.getMessage());
            e.printStackTrace();
        }

        SpringApplication.run(UserServiceApplication.class, args);
    }
}