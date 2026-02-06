package com.financelab.bankservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "credit_scores")
@Data
public class CreditScore {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String userId;
    
    @Column(nullable = false)
    private Integer score;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CreditRating rating;
    
    @Column(nullable = false)
    private LocalDateTime lastUpdated;
    
    @Column
    private String factors;
    
    @Column
    private Integer paymentHistory;
    
    @Column
    private Integer creditUtilization;
    
    @Column
    private Integer creditAge;
    
    @Column
    private Integer creditMix;
    
    @Column
    private Integer newCredit;
    
    public enum CreditRating {
        EXCELLENT,      // 优秀 800-850
        VERY_GOOD,      // 很好 750-799
        GOOD,           // 良好 700-749
        FAIR,           // 一般 650-699
        POOR,           // 较差 600-649
        VERY_POOR       // 很差 300-599
    }
}