package com.financelab.stockservice;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class StockServiceApplication {

    public static void main(String[] args) {
        // 加载 .env 文件（从项目根目录）
        Dotenv dotenv = Dotenv.configure()
                .directory("/opt/mini-biz-sim")
                .ignoreIfMissing()
                .load();

        // 将 .env 中的变量设置到系统属性中
        dotenv.entries().forEach(entry -> {
            System.setProperty(entry.getKey(), entry.getValue());
        });

        SpringApplication.run(StockServiceApplication.class, args);
    }
}