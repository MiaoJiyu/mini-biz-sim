package com.financelab.bankservice.dto;

import com.financelab.bankservice.entity.CreditScore;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreditScoreDTO {
    
    private Long id;
    private String userId;
    private Integer score;
    private CreditScore.CreditRating rating;
    private LocalDateTime lastUpdated;
    private String factors;
    private Integer paymentHistory;
    private Integer creditUtilization;
    private Integer creditAge;
    private Integer creditMix;
    private Integer newCredit;
    
    public CreditScoreDTO() {}
    
    public CreditScoreDTO(CreditScore creditScore) {
        this.id = creditScore.getId();
        this.userId = creditScore.getUserId();
        this.score = creditScore.getScore();
        this.rating = creditScore.getRating();
        this.lastUpdated = creditScore.getLastUpdated();
        this.factors = creditScore.getFactors();
        this.paymentHistory = creditScore.getPaymentHistory();
        this.creditUtilization = creditScore.getCreditUtilization();
        this.creditAge = creditScore.getCreditAge();
        this.creditMix = creditScore.getCreditMix();
        this.newCredit = creditScore.getNewCredit();
    }
}
