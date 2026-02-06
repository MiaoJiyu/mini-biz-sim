package com.financelab.bankservice.service;

import com.financelab.bankservice.dto.*;

import java.math.BigDecimal;
import java.util.List;

public interface BankService {
    
    // 账户管理
    BankAccountDTO createAccount(String userId, BankAccountDTO accountDTO);
    BankAccountDTO getAccount(String accountNumber);
    List<BankAccountDTO> getUserAccounts(String userId);
    void closeAccount(String accountNumber);
    
    // 存款取款
    TransactionDTO deposit(String accountNumber, BigDecimal amount);
    TransactionDTO withdraw(String accountNumber, BigDecimal amount);
    
    // 转账
    TransactionDTO transfer(String fromAccount, String toAccount, BigDecimal amount);
    
    // 贷款管理
    LoanDTO applyForLoan(LoanApplicationDTO application);
    LoanDTO getLoan(Long loanId);
    List<LoanDTO> getUserLoans(String userId);
    TransactionDTO repayLoan(Long loanId, BigDecimal amount);
    
    // 信用卡管理
    CreditCardDTO applyForCreditCard(String userId, String cardHolder);
    CreditCardDTO getCreditCard(String cardNumber);
    List<CreditCardDTO> getUserCreditCards(String userId);
    TransactionDTO creditCardPayment(String cardNumber, BigDecimal amount);
    CreditCardDTO useCreditCard(String cardNumber, BigDecimal amount);
    
    // 理财产品管理
    List<InvestmentProductDTO> getAvailableProducts();
    InvestmentProductDTO getProduct(String productCode);
    UserInvestmentDTO purchaseProduct(String userId, String productCode, BigDecimal amount);
    List<UserInvestmentDTO> getUserInvestments(String userId);
    UserInvestmentDTO redeemInvestment(Long investmentId);
    
    // 信用评分管理
    CreditScoreDTO getCreditScore(String userId);
    void updateCreditScore(String userId);
    
    // 利息计算
    void calculateDailyInterest();
    
    // 账户余额查询
    BigDecimal getAccountBalance(String accountNumber);
    BigDecimal getTotalAssets(String userId);
    
    // 交易历史
    List<TransactionDTO> getTransactionHistory(String accountNumber, int days);
}