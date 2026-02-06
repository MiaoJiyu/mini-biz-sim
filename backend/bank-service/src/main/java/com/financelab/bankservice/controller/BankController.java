package com.financelab.bankservice.controller;

import com.financelab.bankservice.dto.*;
import com.financelab.bankservice.service.BankService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/bank")
@RequiredArgsConstructor
@Slf4j
public class BankController {
    
    private final BankService bankService;
    
    // 账户管理API
    
    @PostMapping("/accounts")
    public ResponseEntity<BankAccountDTO> createAccount(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody BankAccountDTO accountDTO) {
        try {
            BankAccountDTO createdAccount = bankService.createAccount(userId, accountDTO);
            return ResponseEntity.ok(createdAccount);
        } catch (Exception e) {
            log.error("创建账户失败: userId={}, error={}", userId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/accounts/{accountNumber}")
    public ResponseEntity<BankAccountDTO> getAccount(@PathVariable String accountNumber) {
        try {
            BankAccountDTO account = bankService.getAccount(accountNumber);
            if (account != null) {
                return ResponseEntity.ok(account);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("获取账户信息失败: accountNumber={}, error={}", accountNumber, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/accounts")
    public ResponseEntity<List<BankAccountDTO>> getUserAccounts(@RequestHeader("X-User-Id") String userId) {
        try {
            List<BankAccountDTO> accounts = bankService.getUserAccounts(userId);
            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            log.error("获取用户账户列表失败: userId={}, error={}", userId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/accounts/{accountNumber}")
    public ResponseEntity<Void> closeAccount(@PathVariable String accountNumber) {
        try {
            bankService.closeAccount(accountNumber);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("关闭账户失败: accountNumber={}, error={}", accountNumber, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 存款取款API
    
    @PostMapping("/accounts/{accountNumber}/deposit")
    public ResponseEntity<TransactionDTO> deposit(
            @PathVariable String accountNumber,
            @RequestParam BigDecimal amount) {
        try {
            TransactionDTO transaction = bankService.deposit(accountNumber, amount);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            log.error("存款操作失败: accountNumber={}, amount={}, error={}", accountNumber, amount, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/accounts/{accountNumber}/withdraw")
    public ResponseEntity<TransactionDTO> withdraw(
            @PathVariable String accountNumber,
            @RequestParam BigDecimal amount) {
        try {
            TransactionDTO transaction = bankService.withdraw(accountNumber, amount);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            log.error("取款操作失败: accountNumber={}, amount={}, error={}", accountNumber, amount, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 转账API
    
    @PostMapping("/transfer")
    public ResponseEntity<TransactionDTO> transfer(
            @RequestParam String fromAccount,
            @RequestParam String toAccount,
            @RequestParam BigDecimal amount) {
        try {
            TransactionDTO transaction = bankService.transfer(fromAccount, toAccount, amount);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            log.error("转账操作失败: from={}, to={}, amount={}, error={}", 
                     fromAccount, toAccount, amount, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 贷款管理API
    
    @PostMapping("/loans")
    public ResponseEntity<LoanDTO> applyForLoan(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody LoanApplicationDTO application) {
        try {
            application.setUserId(userId);
            LoanDTO loan = bankService.applyForLoan(application);
            return ResponseEntity.ok(loan);
        } catch (Exception e) {
            log.error("贷款申请失败: userId={}, error={}", userId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/loans/{loanId}")
    public ResponseEntity<LoanDTO> getLoan(@PathVariable Long loanId) {
        try {
            LoanDTO loan = bankService.getLoan(loanId);
            if (loan != null) {
                return ResponseEntity.ok(loan);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("获取贷款信息失败: loanId={}, error={}", loanId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/loans")
    public ResponseEntity<List<LoanDTO>> getUserLoans(@RequestHeader("X-User-Id") String userId) {
        try {
            List<LoanDTO> loans = bankService.getUserLoans(userId);
            return ResponseEntity.ok(loans);
        } catch (Exception e) {
            log.error("获取用户贷款列表失败: userId={}, error={}", userId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/loans/{loanId}/repay")
    public ResponseEntity<TransactionDTO> repayLoan(
            @PathVariable Long loanId,
            @RequestParam BigDecimal amount) {
        try {
            TransactionDTO transaction = bankService.repayLoan(loanId, amount);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            log.error("贷款还款失败: loanId={}, amount={}, error={}", loanId, amount, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 查询API
    
    @GetMapping("/accounts/{accountNumber}/balance")
    public ResponseEntity<BigDecimal> getAccountBalance(@PathVariable String accountNumber) {
        try {
            BigDecimal balance = bankService.getAccountBalance(accountNumber);
            return ResponseEntity.ok(balance);
        } catch (Exception e) {
            log.error("获取账户余额失败: accountNumber={}, error={}", accountNumber, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/accounts/total-assets")
    public ResponseEntity<BigDecimal> getTotalAssets(@RequestHeader("X-User-Id") String userId) {
        try {
            BigDecimal totalAssets = bankService.getTotalAssets(userId);
            return ResponseEntity.ok(totalAssets);
        } catch (Exception e) {
            log.error("获取总资产失败: userId={}, error={}", userId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/accounts/{accountNumber}/transactions")
    public ResponseEntity<List<TransactionDTO>> getTransactionHistory(
            @PathVariable String accountNumber,
            @RequestParam(defaultValue = "30") int days) {
        try {
            List<TransactionDTO> transactions = bankService.getTransactionHistory(accountNumber, days);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            log.error("获取交易历史失败: accountNumber={}, days={}, error={}", 
                     accountNumber, days, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 利息计算API（管理员使用）
    
    @PostMapping("/admin/calculate-interest")
    public ResponseEntity<Void> calculateInterest() {
        try {
            bankService.calculateDailyInterest();
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("计算利息失败: error={}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 信用卡管理API
    
    @PostMapping("/credit-cards")
    public ResponseEntity<CreditCardDTO> applyForCreditCard(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam String cardHolder) {
        try {
            CreditCardDTO card = bankService.applyForCreditCard(userId, cardHolder);
            return ResponseEntity.ok(card);
        } catch (Exception e) {
            log.error("申请信用卡失败: userId={}, error={}", userId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/credit-cards/{cardNumber}")
    public ResponseEntity<CreditCardDTO> getCreditCard(@PathVariable String cardNumber) {
        try {
            CreditCardDTO card = bankService.getCreditCard(cardNumber);
            if (card != null) {
                return ResponseEntity.ok(card);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("获取信用卡信息失败: cardNumber={}, error={}", cardNumber, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/credit-cards")
    public ResponseEntity<List<CreditCardDTO>> getUserCreditCards(@RequestHeader("X-User-Id") String userId) {
        try {
            List<CreditCardDTO> cards = bankService.getUserCreditCards(userId);
            return ResponseEntity.ok(cards);
        } catch (Exception e) {
            log.error("获取用户信用卡列表失败: userId={}, error={}", userId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/credit-cards/{cardNumber}/payment")
    public ResponseEntity<TransactionDTO> creditCardPayment(
            @PathVariable String cardNumber,
            @RequestParam BigDecimal amount) {
        try {
            TransactionDTO transaction = bankService.creditCardPayment(cardNumber, amount);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            log.error("信用卡还款失败: cardNumber={}, amount={}, error={}", cardNumber, amount, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/credit-cards/{cardNumber}/purchase")
    public ResponseEntity<CreditCardDTO> useCreditCard(
            @PathVariable String cardNumber,
            @RequestParam BigDecimal amount) {
        try {
            CreditCardDTO card = bankService.useCreditCard(cardNumber, amount);
            return ResponseEntity.ok(card);
        } catch (Exception e) {
            log.error("信用卡消费失败: cardNumber={}, amount={}, error={}", cardNumber, amount, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 理财产品管理API
    
    @GetMapping("/investment-products")
    public ResponseEntity<List<InvestmentProductDTO>> getAvailableProducts() {
        try {
            List<InvestmentProductDTO> products = bankService.getAvailableProducts();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            log.error("获取理财产品列表失败: error={}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/investment-products/{productCode}")
    public ResponseEntity<InvestmentProductDTO> getProduct(@PathVariable String productCode) {
        try {
            InvestmentProductDTO product = bankService.getProduct(productCode);
            if (product != null) {
                return ResponseEntity.ok(product);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("获取理财产品信息失败: productCode={}, error={}", productCode, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/investments/purchase")
    public ResponseEntity<UserInvestmentDTO> purchaseProduct(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam String productCode,
            @RequestParam BigDecimal amount) {
        try {
            UserInvestmentDTO investment = bankService.purchaseProduct(userId, productCode, amount);
            return ResponseEntity.ok(investment);
        } catch (Exception e) {
            log.error("购买理财产品失败: userId={}, productCode={}, error={}", userId, productCode, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/investments")
    public ResponseEntity<List<UserInvestmentDTO>> getUserInvestments(@RequestHeader("X-User-Id") String userId) {
        try {
            List<UserInvestmentDTO> investments = bankService.getUserInvestments(userId);
            return ResponseEntity.ok(investments);
        } catch (Exception e) {
            log.error("获取用户投资列表失败: userId={}, error={}", userId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/investments/{investmentId}/redeem")
    public ResponseEntity<UserInvestmentDTO> redeemInvestment(@PathVariable Long investmentId) {
        try {
            UserInvestmentDTO investment = bankService.redeemInvestment(investmentId);
            return ResponseEntity.ok(investment);
        } catch (Exception e) {
            log.error("赎回理财产品失败: investmentId={}, error={}", investmentId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 信用评分管理API
    
    @GetMapping("/credit-score")
    public ResponseEntity<CreditScoreDTO> getCreditScore(@RequestHeader("X-User-Id") String userId) {
        try {
            CreditScoreDTO creditScore = bankService.getCreditScore(userId);
            if (creditScore != null) {
                return ResponseEntity.ok(creditScore);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("获取信用评分失败: userId={}, error={}", userId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/credit-score/update")
    public ResponseEntity<Void> updateCreditScore(@RequestHeader("X-User-Id") String userId) {
        try {
            bankService.updateCreditScore(userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("更新信用评分失败: userId={}, error={}", userId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}