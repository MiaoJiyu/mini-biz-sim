package com.financelab.bankservice.service.impl;

import com.financelab.bankservice.dto.*;
import com.financelab.bankservice.entity.*;
import com.financelab.bankservice.repository.*;
import com.financelab.bankservice.service.BankService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BankServiceImpl implements BankService {
    
    private final BankAccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final LoanRepository loanRepository;
    private final CreditScoreRepository creditScoreRepository;
    private final CreditCardRepository creditCardRepository;
    private final InvestmentProductRepository investmentProductRepository;
    private final UserInvestmentRepository userInvestmentRepository;
    
    @Override
    @Transactional
    public BankAccountDTO createAccount(String userId, BankAccountDTO accountDTO) {
        // 生成唯一账户号码
        String accountNumber = generateAccountNumber();
        
        BankAccount account = new BankAccount();
        account.setUserId(userId);
        account.setAccountNumber(accountNumber);
        account.setAccountType(accountDTO.getAccountType());
        account.setBalance(BigDecimal.ZERO);
        account.setAvailableBalance(BigDecimal.ZERO);
        account.setInterestRate(getDefaultInterestRate(accountDTO.getAccountType()));
        account.setCreatedAt(LocalDateTime.now());
        account.setIsActive(true);
        
        BankAccount savedAccount = accountRepository.save(account);
        log.info("创建银行账户: userId={}, accountNumber={}, type={}", userId, accountNumber, accountDTO.getAccountType());
        
        return new BankAccountDTO(savedAccount);
    }
    
    @Override
    public BankAccountDTO getAccount(String accountNumber) {
        Optional<BankAccount> account = accountRepository.findByAccountNumber(accountNumber);
        return account.map(BankAccountDTO::new).orElse(null);
    }
    
    @Override
    public List<BankAccountDTO> getUserAccounts(String userId) {
        List<BankAccount> accounts = accountRepository.findByUserId(userId);
        return accounts.stream()
                .map(BankAccountDTO::new)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public void closeAccount(String accountNumber) {
        Optional<BankAccount> accountOpt = accountRepository.findByAccountNumber(accountNumber);
        if (accountOpt.isPresent()) {
            BankAccount account = accountOpt.get();
            if (account.getBalance().compareTo(BigDecimal.ZERO) == 0) {
                account.setIsActive(false);
                accountRepository.save(account);
                log.info("关闭银行账户: accountNumber={}", accountNumber);
            } else {
                throw new RuntimeException("账户余额不为零，无法关闭");
            }
        }
    }
    
    @Override
    @Transactional
    public TransactionDTO deposit(String accountNumber, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("存款金额必须大于零");
        }
        
        Optional<BankAccount> accountOpt = accountRepository.findByAccountNumber(accountNumber);
        if (accountOpt.isEmpty()) {
            throw new RuntimeException("账户不存在");
        }
        
        BankAccount account = accountOpt.get();
        if (!account.getIsActive()) {
            throw new RuntimeException("账户已关闭");
        }
        
        // 更新账户余额
        BigDecimal newBalance = account.getBalance().add(amount);
        account.setBalance(newBalance);
        account.setAvailableBalance(newBalance);
        account.setUpdatedAt(LocalDateTime.now());
        accountRepository.save(account);
        
        // 创建交易记录
        Transaction transaction = new Transaction();
        transaction.setFromAccountNumber("BANK");
        transaction.setToAccountNumber(accountNumber);
        transaction.setType(Transaction.TransactionType.DEPOSIT);
        transaction.setAmount(amount);
        transaction.setFee(BigDecimal.ZERO);
        transaction.setBalanceAfter(newBalance);
        transaction.setTransactionTime(LocalDateTime.now());
        transaction.setDescription("存款操作");
        transaction.setReferenceNumber(generateReferenceNumber());
        transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        log.info("存款操作: accountNumber={}, amount={}", accountNumber, amount);
        
        return new TransactionDTO(savedTransaction);
    }
    
    @Override
    @Transactional
    public TransactionDTO withdraw(String accountNumber, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("取款金额必须大于零");
        }
        
        Optional<BankAccount> accountOpt = accountRepository.findByAccountNumber(accountNumber);
        if (accountOpt.isEmpty()) {
            throw new RuntimeException("账户不存在");
        }
        
        BankAccount account = accountOpt.get();
        if (!account.getIsActive()) {
            throw new RuntimeException("账户已关闭");
        }
        
        if (account.getAvailableBalance().compareTo(amount) < 0) {
            throw new RuntimeException("余额不足");
        }
        
        // 计算手续费（取款金额的1%）
        BigDecimal fee = amount.multiply(new BigDecimal("0.01")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = amount.add(fee);
        
        // 更新账户余额
        BigDecimal newBalance = account.getBalance().subtract(totalAmount);
        account.setBalance(newBalance);
        account.setAvailableBalance(newBalance);
        account.setUpdatedAt(LocalDateTime.now());
        accountRepository.save(account);
        
        // 创建交易记录
        Transaction transaction = new Transaction();
        transaction.setFromAccountNumber(accountNumber);
        transaction.setToAccountNumber("BANK");
        transaction.setType(Transaction.TransactionType.WITHDRAWAL);
        transaction.setAmount(amount);
        transaction.setFee(fee);
        transaction.setBalanceAfter(newBalance);
        transaction.setTransactionTime(LocalDateTime.now());
        transaction.setDescription("取款操作");
        transaction.setReferenceNumber(generateReferenceNumber());
        transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        log.info("取款操作: accountNumber={}, amount={}, fee={}", accountNumber, amount, fee);
        
        return new TransactionDTO(savedTransaction);
    }
    
    @Override
    @Transactional
    public TransactionDTO transfer(String fromAccount, String toAccount, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("转账金额必须大于零");
        }
        
        if (fromAccount.equals(toAccount)) {
            throw new RuntimeException("不能向自己转账");
        }
        
        Optional<BankAccount> fromAccountOpt = accountRepository.findByAccountNumber(fromAccount);
        Optional<BankAccount> toAccountOpt = accountRepository.findByAccountNumber(toAccount);
        
        if (fromAccountOpt.isEmpty() || toAccountOpt.isEmpty()) {
            throw new RuntimeException("账户不存在");
        }
        
        BankAccount from = fromAccountOpt.get();
        BankAccount to = toAccountOpt.get();
        
        if (!from.getIsActive() || !to.getIsActive()) {
            throw new RuntimeException("账户已关闭");
        }
        
        if (from.getAvailableBalance().compareTo(amount) < 0) {
            throw new RuntimeException("余额不足");
        }
        
        // 计算手续费（转账金额的0.5%）
        BigDecimal fee = amount.multiply(new BigDecimal("0.005")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = amount.add(fee);
        
        // 更新转出账户余额
        BigDecimal fromNewBalance = from.getBalance().subtract(totalAmount);
        from.setBalance(fromNewBalance);
        from.setAvailableBalance(fromNewBalance);
        from.setUpdatedAt(LocalDateTime.now());
        
        // 更新转入账户余额
        BigDecimal toNewBalance = to.getBalance().add(amount);
        to.setBalance(toNewBalance);
        to.setAvailableBalance(toNewBalance);
        to.setUpdatedAt(LocalDateTime.now());
        
        accountRepository.save(from);
        accountRepository.save(to);
        
        // 创建交易记录
        Transaction transaction = new Transaction();
        transaction.setFromAccountNumber(fromAccount);
        transaction.setToAccountNumber(toAccount);
        transaction.setType(Transaction.TransactionType.TRANSFER);
        transaction.setAmount(amount);
        transaction.setFee(fee);
        transaction.setBalanceAfter(fromNewBalance);
        transaction.setTransactionTime(LocalDateTime.now());
        transaction.setDescription("转账操作");
        transaction.setReferenceNumber(generateReferenceNumber());
        transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        log.info("转账操作: from={}, to={}, amount={}, fee={}", fromAccount, toAccount, amount, fee);
        
        return new TransactionDTO(savedTransaction);
    }
    
    @Override
    @Transactional
    public LoanDTO applyForLoan(LoanApplicationDTO application) {
        // 获取用户信用评分
        CreditScore creditScore = getOrCreateCreditScore(application.getUserId());
        
        // 风险评估
        if (!isLoanApproved(application, creditScore)) {
            Loan loan = createRejectedLoan(application);
            Loan savedLoan = loanRepository.save(loan);
            return new LoanDTO(savedLoan);
        }
        
        // 计算月供
        BigDecimal monthlyPayment = calculateMonthlyPayment(
            application.getAmount(), 
            application.getInterestRate(), 
            application.getTermMonths()
        );
        
        // 创建贷款记录
        Loan loan = new Loan();
        loan.setUserId(application.getUserId());
        loan.setLoanType(application.getLoanType());
        loan.setPrincipalAmount(application.getAmount());
        loan.setRemainingAmount(application.getAmount());
        loan.setInterestRate(application.getInterestRate());
        loan.setTermMonths(application.getTermMonths());
        loan.setRemainingMonths(application.getTermMonths());
        loan.setMonthlyPayment(monthlyPayment);
        loan.setStatus(Loan.LoanStatus.APPROVED);
        loan.setCreatedAt(LocalDateTime.now());
        loan.setApprovedAt(LocalDateTime.now());
        loan.setNextPaymentDate(LocalDateTime.now().plusMonths(1));
        loan.setTotalInterestPaid(BigDecimal.ZERO);
        loan.setLateFee(BigDecimal.ZERO);
        loan.setOverdueDays(0);
        
        Loan savedLoan = loanRepository.save(loan);
        log.info("贷款申请批准: userId={}, loanId={}, amount={}", application.getUserId(), savedLoan.getId(), application.getAmount());
        
        return new LoanDTO(savedLoan);
    }
    
    @Override
    public LoanDTO getLoan(Long loanId) {
        Optional<Loan> loan = loanRepository.findById(loanId);
        return loan.map(LoanDTO::new).orElse(null);
    }
    
    @Override
    public List<LoanDTO> getUserLoans(String userId) {
        List<Loan> loans = loanRepository.findByUserId(userId);
        return loans.stream()
                .map(LoanDTO::new)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public TransactionDTO repayLoan(Long loanId, BigDecimal amount) {
        Optional<Loan> loanOpt = loanRepository.findById(loanId);
        if (loanOpt.isEmpty()) {
            throw new RuntimeException("贷款不存在");
        }
        
        Loan loan = loanOpt.get();
        if (loan.getStatus() != Loan.LoanStatus.ACTIVE) {
            throw new RuntimeException("贷款状态无效");
        }
        
        // 查找用户的储蓄账户
        Optional<BankAccount> accountOpt = accountRepository.findByUserIdAndAccountType(
            loan.getUserId(), BankAccount.AccountType.SAVINGS
        );
        
        if (accountOpt.isEmpty()) {
            throw new RuntimeException("未找到储蓄账户");
        }
        
        BankAccount account = accountOpt.get();
        if (account.getAvailableBalance().compareTo(amount) < 0) {
            throw new RuntimeException("账户余额不足");
        }
        
        // 更新贷款信息
        BigDecimal remainingAfterPayment = loan.getRemainingAmount().subtract(amount);
        loan.setRemainingAmount(remainingAfterPayment);
        
        if (remainingAfterPayment.compareTo(BigDecimal.ZERO) <= 0) {
            loan.setStatus(Loan.LoanStatus.PAID_OFF);
            loan.setCompletedAt(LocalDateTime.now());
        } else {
            loan.setRemainingMonths(loan.getRemainingMonths() - 1);
            loan.setNextPaymentDate(loan.getNextPaymentDate().plusMonths(1));
        }
        
        loanRepository.save(loan);
        
        // 从账户扣款
        BigDecimal newBalance = account.getBalance().subtract(amount);
        account.setBalance(newBalance);
        account.setAvailableBalance(newBalance);
        accountRepository.save(account);
        
        // 创建还款记录
        Transaction transaction = new Transaction();
        transaction.setFromAccountNumber(account.getAccountNumber());
        transaction.setToAccountNumber("BANK");
        transaction.setType(Transaction.TransactionType.LOAN_REPAYMENT);
        transaction.setAmount(amount);
        transaction.setFee(BigDecimal.ZERO);
        transaction.setBalanceAfter(newBalance);
        transaction.setTransactionTime(LocalDateTime.now());
        transaction.setDescription("贷款还款");
        transaction.setReferenceNumber(generateReferenceNumber());
        transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        log.info("贷款还款: loanId={}, amount={}", loanId, amount);
        
        return new TransactionDTO(savedTransaction);
    }
    
    @Override
    @Transactional
    public void calculateDailyInterest() {
        List<BankAccount> activeAccounts = accountRepository.findByIsActiveTrue();
        LocalDateTime now = LocalDateTime.now();
        
        for (BankAccount account : activeAccounts) {
            if (account.getInterestRate() != null && account.getInterestRate().compareTo(BigDecimal.ZERO) > 0) {
                // 计算日利息
                BigDecimal dailyInterest = account.getBalance()
                    .multiply(account.getInterestRate())
                    .divide(new BigDecimal("36500"), 2, RoundingMode.HALF_UP);
                
                if (dailyInterest.compareTo(BigDecimal.ZERO) > 0) {
                    BigDecimal newBalance = account.getBalance().add(dailyInterest);
                    account.setBalance(newBalance);
                    account.setAvailableBalance(newBalance);
                    account.setUpdatedAt(now);
                    
                    // 创建利息记录
                    Transaction transaction = new Transaction();
                    transaction.setFromAccountNumber("BANK");
                    transaction.setToAccountNumber(account.getAccountNumber());
                    transaction.setType(Transaction.TransactionType.INTEREST_PAYMENT);
                    transaction.setAmount(dailyInterest);
                    transaction.setFee(BigDecimal.ZERO);
                    transaction.setBalanceAfter(newBalance);
                    transaction.setTransactionTime(now);
                    transaction.setDescription("日利息结算");
                    transaction.setReferenceNumber(generateReferenceNumber());
                    transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
                    
                    transactionRepository.save(transaction);
                }
            }
        }
        
        log.info("日利息计算完成，处理账户数量: {}", activeAccounts.size());
    }
    
    @Override
    public BigDecimal getAccountBalance(String accountNumber) {
        Optional<BankAccount> account = accountRepository.findByAccountNumber(accountNumber);
        return account.map(BankAccount::getBalance).orElse(BigDecimal.ZERO);
    }
    
    @Override
    public BigDecimal getTotalAssets(String userId) {
        Optional<Double> totalBalance = accountRepository.getTotalBalanceByUserId(userId);
        return BigDecimal.valueOf(totalBalance.orElse(0.0));
    }
    
    @Override
    public List<TransactionDTO> getTransactionHistory(String accountNumber, int days) {
        LocalDateTime startDate = LocalDateTime.now().minusDays(days);
        List<Transaction> transactions = transactionRepository.findByAccountNumberAndDateRange(
            accountNumber, startDate, LocalDateTime.now()
        );
        
        return transactions.stream()
                .map(TransactionDTO::new)
                .collect(Collectors.toList());
    }
    
    // 辅助方法
    private String generateAccountNumber() {
        return "62" + String.format("%010d", System.currentTimeMillis() % 10000000000L);
    }
    
    private String generateReferenceNumber() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase();
    }
    
    private BigDecimal getDefaultInterestRate(BankAccount.AccountType accountType) {
        switch (accountType) {
            case SAVINGS: return new BigDecimal("1.5");
            case CURRENT: return new BigDecimal("0.3");
            case FIXED_DEPOSIT: return new BigDecimal("3.0");
            case INVESTMENT: return new BigDecimal("2.5");
            case CREDIT_CARD: return new BigDecimal("18.0");
            default: return new BigDecimal("0.5");
        }
    }
    
    private CreditScore getOrCreateCreditScore(String userId) {
        Optional<CreditScore> creditScoreOpt = creditScoreRepository.findByUserId(userId);
        if (creditScoreOpt.isPresent()) {
            return creditScoreOpt.get();
        }
        
        // 创建初始信用评分
        CreditScore creditScore = new CreditScore();
        creditScore.setUserId(userId);
        creditScore.setScore(650); // 初始分数
        creditScore.setRating(CreditScore.CreditRating.FAIR);
        creditScore.setLastUpdated(LocalDateTime.now());
        
        return creditScoreRepository.save(creditScore);
    }
    
    private boolean isLoanApproved(LoanApplicationDTO application, CreditScore creditScore) {
        // 基本的贷款审批逻辑
        if (creditScore.getScore() < 600) {
            return false; // 信用评分过低
        }
        
        if (application.getAmount().compareTo(new BigDecimal("100000")) > 0 && creditScore.getScore() < 700) {
            return false; // 大额贷款需要更高信用评分
        }
        
        return true;
    }
    
    private Loan createRejectedLoan(LoanApplicationDTO application) {
        Loan loan = new Loan();
        loan.setUserId(application.getUserId());
        loan.setLoanType(application.getLoanType());
        loan.setPrincipalAmount(application.getAmount());
        loan.setRemainingAmount(application.getAmount());
        loan.setInterestRate(application.getInterestRate());
        loan.setTermMonths(application.getTermMonths());
        loan.setRemainingMonths(application.getTermMonths());
        loan.setMonthlyPayment(BigDecimal.ZERO);
        loan.setStatus(Loan.LoanStatus.REJECTED);
        loan.setCreatedAt(LocalDateTime.now());
        loan.setTotalInterestPaid(BigDecimal.ZERO);
        loan.setLateFee(BigDecimal.ZERO);
        loan.setOverdueDays(0);
        
        return loan;
    }
    
    private BigDecimal calculateMonthlyPayment(BigDecimal principal, BigDecimal annualRate, int months) {
        if (months <= 0) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal monthlyRate = annualRate.divide(new BigDecimal("1200"), 10, RoundingMode.HALF_UP);
        BigDecimal numerator = monthlyRate.multiply(principal);
        BigDecimal denominator = BigDecimal.ONE.subtract(
            BigDecimal.ONE.add(monthlyRate).pow(-months, new java.math.MathContext(10))
        );
        
        return numerator.divide(denominator, 2, RoundingMode.HALF_UP);
    }
    
    // 信用卡管理方法
    
    @Override
    @Transactional
    public CreditCardDTO applyForCreditCard(String userId, String cardHolder) {
        // 检查用户是否已有活跃信用卡
        List<CreditCard> existingCards = creditCardRepository.findByUserId(userId);
        for (CreditCard card : existingCards) {
            if (card.getStatus() == CreditCard.CardStatus.ACTIVE) {
                throw new RuntimeException("已存在活跃信用卡");
            }
        }
        
        // 根据信用评分确定信用额度
        CreditScore creditScore = getOrCreateCreditScore(userId);
        BigDecimal creditLimit = calculateCreditLimit(creditScore.getScore());
        
        CreditCard creditCard = new CreditCard();
        creditCard.setUserId(userId);
        creditCard.setCardNumber(generateCardNumber());
        creditCard.setCardHolder(cardHolder);
        creditCard.setExpiryDate(java.time.LocalDate.now().plusYears(3));
        creditCard.setCvv(generateCVV());
        creditCard.setCreditLimit(creditLimit);
        creditCard.setUsedLimit(BigDecimal.ZERO);
        creditCard.setAvailableLimit(creditLimit);
        creditCard.setInterestRate(new BigDecimal("18.0"));
        creditCard.setLatePaymentFee(new BigDecimal("50.0"));
        creditCard.setBillingCycleStart(java.time.LocalDate.now());
        creditCard.setBillingCycleEnd(java.time.LocalDate.now().plusDays(30));
        creditCard.setPaymentDueDate(java.time.LocalDate.now().plusDays(45));
        creditCard.setCurrentBalance(BigDecimal.ZERO);
        creditCard.setMinimumPayment(BigDecimal.ZERO);
        creditCard.setStatus(CreditCard.CardStatus.ACTIVE);
        creditCard.setCreatedAt(LocalDateTime.now());
        
        CreditCard savedCard = creditCardRepository.save(creditCard);
        log.info("信用卡申请成功: userId={}, cardNumber={}, limit={}", userId, savedCard.getCardNumber(), creditLimit);
        
        return new CreditCardDTO(savedCard);
    }
    
    @Override
    public CreditCardDTO getCreditCard(String cardNumber) {
        Optional<CreditCard> card = creditCardRepository.findByCardNumber(cardNumber);
        return card.map(CreditCardDTO::new).orElse(null);
    }
    
    @Override
    public List<CreditCardDTO> getUserCreditCards(String userId) {
        List<CreditCard> cards = creditCardRepository.findByUserId(userId);
        return cards.stream()
                .map(CreditCardDTO::new)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public TransactionDTO creditCardPayment(String cardNumber, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("还款金额必须大于零");
        }
        
        Optional<CreditCard> cardOpt = creditCardRepository.findByCardNumber(cardNumber);
        if (cardOpt.isEmpty()) {
            throw new RuntimeException("信用卡不存在");
        }
        
        CreditCard card = cardOpt.get();
        if (card.getStatus() != CreditCard.CardStatus.ACTIVE) {
            throw new RuntimeException("信用卡状态无效");
        }
        
        // 查找用户储蓄账户
        Optional<BankAccount> accountOpt = accountRepository.findByUserIdAndAccountType(
            card.getUserId(), BankAccount.AccountType.SAVINGS
        );
        
        if (accountOpt.isEmpty()) {
            throw new RuntimeException("未找到储蓄账户");
        }
        
        BankAccount account = accountOpt.get();
        if (account.getAvailableBalance().compareTo(amount) < 0) {
            throw new RuntimeException("账户余额不足");
        }
        
        // 从账户扣款
        BigDecimal newBalance = account.getBalance().subtract(amount);
        account.setBalance(newBalance);
        account.setAvailableBalance(newBalance);
        accountRepository.save(account);
        
        // 更新信用卡余额
        BigDecimal cardBalance = card.getCurrentBalance().subtract(amount);
        if (cardBalance.compareTo(BigDecimal.ZERO) < 0) {
            cardBalance = BigDecimal.ZERO;
        }
        card.setCurrentBalance(cardBalance);
        card.setUsedLimit(cardBalance);
        card.setAvailableLimit(card.getCreditLimit().subtract(cardBalance));
        
        // 计算最低还款额（当期余额的5%）
        card.setMinimumPayment(card.getCurrentBalance().multiply(new BigDecimal("0.05")).setScale(2, RoundingMode.HALF_UP));
        card.setUpdatedAt(LocalDateTime.now());
        creditCardRepository.save(card);
        
        // 创建交易记录
        Transaction transaction = new Transaction();
        transaction.setFromAccountNumber(account.getAccountNumber());
        transaction.setToAccountNumber(cardNumber);
        transaction.setType(Transaction.TransactionType.LOAN_REPAYMENT);
        transaction.setAmount(amount);
        transaction.setFee(BigDecimal.ZERO);
        transaction.setBalanceAfter(newBalance);
        transaction.setTransactionTime(LocalDateTime.now());
        transaction.setDescription("信用卡还款");
        transaction.setReferenceNumber(generateReferenceNumber());
        transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        log.info("信用卡还款: cardNumber={}, amount={}", cardNumber, amount);
        
        return new TransactionDTO(savedTransaction);
    }
    
    @Override
    @Transactional
    public CreditCardDTO useCreditCard(String cardNumber, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("消费金额必须大于零");
        }
        
        Optional<CreditCard> cardOpt = creditCardRepository.findByCardNumber(cardNumber);
        if (cardOpt.isEmpty()) {
            throw new RuntimeException("信用卡不存在");
        }
        
        CreditCard card = cardOpt.get();
        if (card.getStatus() != CreditCard.CardStatus.ACTIVE) {
            throw new RuntimeException("信用卡状态无效");
        }
        
        if (card.getAvailableLimit().compareTo(amount) < 0) {
            throw new RuntimeException("信用额度不足");
        }
        
        // 更新信用卡余额
        BigDecimal newUsedLimit = card.getUsedLimit().add(amount);
        card.setUsedLimit(newUsedLimit);
        card.setAvailableLimit(card.getCreditLimit().subtract(newUsedLimit));
        card.setCurrentBalance(newUsedLimit);
        card.setMinimumPayment(newUsedLimit.multiply(new BigDecimal("0.05")).setScale(2, RoundingMode.HALF_UP));
        card.setUpdatedAt(LocalDateTime.now());
        
        CreditCard savedCard = creditCardRepository.save(card);
        log.info("信用卡消费: cardNumber={}, amount={}", cardNumber, amount);
        
        return new CreditCardDTO(savedCard);
    }
    
    // 理财产品管理方法
    
    @Override
    public List<InvestmentProductDTO> getAvailableProducts() {
        List<InvestmentProduct> products = investmentProductRepository.findAvailableProductsSortedByReturn();
        return products.stream()
                .map(InvestmentProductDTO::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public InvestmentProductDTO getProduct(String productCode) {
        Optional<InvestmentProduct> product = investmentProductRepository.findByProductCode(productCode);
        return product.map(InvestmentProductDTO::new).orElse(null);
    }
    
    @Override
    @Transactional
    public UserInvestmentDTO purchaseProduct(String userId, String productCode, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("投资金额必须大于零");
        }
        
        Optional<InvestmentProduct> productOpt = investmentProductRepository.findByProductCode(productCode);
        if (productOpt.isEmpty()) {
            throw new RuntimeException("理财产品不存在");
        }
        
        InvestmentProduct product = productOpt.get();
        if (product.getStatus() != InvestmentProduct.ProductStatus.AVAILABLE) {
            throw new RuntimeException("理财产品不可购买");
        }
        
        if (amount.compareTo(product.getMinInvestmentAmount()) < 0) {
            throw new RuntimeException("投资金额低于最低投资门槛");
        }
        
        if (amount.compareTo(product.getMaxInvestmentAmount()) > 0) {
            throw new RuntimeException("投资金额超过最高投资限额");
        }
        
        // 查找用户储蓄账户
        Optional<BankAccount> accountOpt = accountRepository.findByUserIdAndAccountType(
            userId, BankAccount.AccountType.SAVINGS
        );
        
        if (accountOpt.isEmpty()) {
            throw new RuntimeException("未找到储蓄账户");
        }
        
        BankAccount account = accountOpt.get();
        if (account.getAvailableBalance().compareTo(amount) < 0) {
            throw new RuntimeException("账户余额不足");
        }
        
        // 从账户扣款
        BigDecimal newBalance = account.getBalance().subtract(amount);
        account.setBalance(newBalance);
        account.setAvailableBalance(newBalance);
        accountRepository.save(account);
        
        // 创建投资记录
        UserInvestment investment = new UserInvestment();
        investment.setUserId(userId);
        investment.setProductId(product.getId());
        investment.setProductName(product.getProductName());
        investment.setInvestmentAmount(amount);
        investment.setCurrentAmount(amount);
        investment.setAccumulatedReturn(BigDecimal.ZERO);
        investment.setStatus(UserInvestment.InvestmentStatus.ACTIVE);
        investment.setPurchaseDate(LocalDateTime.now());
        investment.setMaturityDate(LocalDateTime.now().plusDays(product.getTermDays()));
        
        UserInvestment savedInvestment = userInvestmentRepository.save(investment);
        
        // 创建交易记录
        Transaction transaction = new Transaction();
        transaction.setFromAccountNumber(account.getAccountNumber());
        transaction.setToAccountNumber("INVESTMENT");
        transaction.setType(Transaction.TransactionType.WITHDRAWAL);
        transaction.setAmount(amount);
        transaction.setFee(BigDecimal.ZERO);
        transaction.setBalanceAfter(newBalance);
        transaction.setTransactionTime(LocalDateTime.now());
        transaction.setDescription("购买理财产品: " + product.getProductName());
        transaction.setReferenceNumber(generateReferenceNumber());
        transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
        
        transactionRepository.save(transaction);
        log.info("购买理财产品: userId={}, product={}, amount={}", userId, product.getProductName(), amount);
        
        return new UserInvestmentDTO(savedInvestment);
    }
    
    @Override
    public List<UserInvestmentDTO> getUserInvestments(String userId) {
        List<UserInvestment> investments = userInvestmentRepository.findByUserId(userId);
        return investments.stream()
                .map(UserInvestmentDTO::new)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public UserInvestmentDTO redeemInvestment(Long investmentId) {
        Optional<UserInvestment> investmentOpt = userInvestmentRepository.findById(investmentId);
        if (investmentOpt.isEmpty()) {
            throw new RuntimeException("投资记录不存在");
        }
        
        UserInvestment investment = investmentOpt.get();
        if (investment.getStatus() != UserInvestment.InvestmentStatus.ACTIVE) {
            throw new RuntimeException("投资状态无效");
        }
        
        // 查找用户储蓄账户
        Optional<BankAccount> accountOpt = accountRepository.findByUserIdAndAccountType(
            investment.getUserId(), BankAccount.AccountType.SAVINGS
        );
        
        if (accountOpt.isEmpty()) {
            throw new RuntimeException("未找到储蓄账户");
        }
        
        BankAccount account = accountOpt.get();
        
        // 计算赎回金额（本金 + 累积收益）
        BigDecimal redeemAmount = investment.getCurrentAmount().add(investment.getAccumulatedReturn());
        
        // 更新账户余额
        BigDecimal newBalance = account.getBalance().add(redeemAmount);
        account.setBalance(newBalance);
        account.setAvailableBalance(newBalance);
        accountRepository.save(account);
        
        // 更新投资状态
        investment.setStatus(UserInvestment.InvestmentStatus.WITHDRAWN);
        investment.setUpdatedAt(LocalDateTime.now());
        userInvestmentRepository.save(investment);
        
        // 创建交易记录
        Transaction transaction = new Transaction();
        transaction.setFromAccountNumber("INVESTMENT");
        transaction.setToAccountNumber(account.getAccountNumber());
        transaction.setType(Transaction.TransactionType.DEPOSIT);
        transaction.setAmount(redeemAmount);
        transaction.setFee(BigDecimal.ZERO);
        transaction.setBalanceAfter(newBalance);
        transaction.setTransactionTime(LocalDateTime.now());
        transaction.setDescription("赎回理财产品: " + investment.getProductName());
        transaction.setReferenceNumber(generateReferenceNumber());
        transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
        
        transactionRepository.save(transaction);
        log.info("赎回理财产品: investmentId={}, amount={}", investmentId, redeemAmount);
        
        return new UserInvestmentDTO(investment);
    }
    
    // 信用评分管理方法
    
    @Override
    public CreditScoreDTO getCreditScore(String userId) {
        Optional<CreditScore> creditScore = creditScoreRepository.findByUserId(userId);
        return creditScore.map(CreditScoreDTO::new).orElse(null);
    }
    
    @Override
    @Transactional
    public void updateCreditScore(String userId) {
        Optional<CreditScore> creditScoreOpt = creditScoreRepository.findByUserId(userId);
        if (creditScoreOpt.isEmpty()) {
            return;
        }
        
        CreditScore creditScore = creditScoreOpt.get();
        
        // 计算信用评分的各个因素
        creditScore.setPaymentHistory(calculatePaymentHistory(userId));
        creditScore.setCreditUtilization(calculateCreditUtilization(userId));
        creditScore.setCreditAge(calculateCreditAge(userId));
        creditScore.setCreditMix(calculateCreditMix(userId));
        creditScore.setNewCredit(calculateNewCredit(userId));
        
        // 计算总分
        int newScore = 300;
        newScore += creditScore.getPaymentHistory();
        newScore += creditScore.getCreditUtilization();
        newScore += creditScore.getCreditAge();
        newScore += creditScore.getCreditMix();
        newScore += creditScore.getNewCredit();
        
        // 确保分数在300-850范围内
        newScore = Math.max(300, Math.min(850, newScore));
        creditScore.setScore(newScore);
        creditScore.setRating(determineCreditRating(newScore));
        creditScore.setLastUpdated(LocalDateTime.now());
        
        creditScoreRepository.save(creditScore);
        log.info("更新信用评分: userId={}, score={}", userId, newScore);
    }
    
    // 辅助方法
    
    private String generateCardNumber() {
        return "4" + String.format("%015d", (long)(Math.random() * 1000000000000000L));
    }
    
    private Integer generateCVV() {
        return (int)(Math.random() * 900) + 100;
    }
    
    private BigDecimal calculateCreditLimit(int creditScore) {
        if (creditScore >= 800) {
            return new BigDecimal("100000");
        } else if (creditScore >= 750) {
            return new BigDecimal("50000");
        } else if (creditScore >= 700) {
            return new BigDecimal("30000");
        } else if (creditScore >= 650) {
            return new BigDecimal("20000");
        } else if (creditScore >= 600) {
            return new BigDecimal("10000");
        } else {
            return new BigDecimal("5000");
        }
    }
    
    private int calculatePaymentHistory(String userId) {
        List<Loan> loans = loanRepository.findByUserId(userId);
        int onTimePayments = 0;
        int totalPayments = 0;
        
        for (Loan loan : loans) {
            if (loan.getStatus() == Loan.LoanStatus.PAID_OFF || 
                loan.getStatus() == Loan.LoanStatus.ACTIVE) {
                totalPayments += (loan.getTermMonths() - loan.getRemainingMonths());
                onTimePayments += (loan.getTermMonths() - loan.getRemainingMonths());
            }
        }
        
        if (totalPayments == 0) return 150;
        return (int)((double)onTimePayments / totalPayments * 150);
    }
    
    private int calculateCreditUtilization(String userId) {
        Optional<Double> totalUsed = creditCardRepository.getTotalUsedLimitByUserId(userId);
        Optional<Double> totalLimit = creditCardRepository.getTotalCreditLimitByUserId(userId);
        
        if (totalLimit.isEmpty() || totalLimit.get() == 0) return 100;
        
        double utilization = (totalUsed.orElse(0.0) / totalLimit.get());
        return (int)((1 - utilization) * 150);
    }
    
    private int calculateCreditAge(String userId) {
        List<BankAccount> accounts = accountRepository.findByUserId(userId);
        if (accounts.isEmpty()) return 50;
        
        LocalDateTime oldestAccount = accounts.stream()
            .map(BankAccount::getCreatedAt)
            .min(LocalDateTime::compareTo)
            .orElse(LocalDateTime.now());
        
        long months = java.time.temporal.ChronoUnit.MONTHS.between(oldestAccount, LocalDateTime.now());
        return (int)Math.min(months * 2, 100);
    }
    
    private int calculateCreditMix(String userId) {
        List<BankAccount> accounts = accountRepository.findByUserId(userId);
        long uniqueTypes = accounts.stream()
            .map(BankAccount::getAccountType)
            .distinct()
            .count();
        
        return (int)uniqueTypes * 25;
    }
    
    private int calculateNewCredit(String userId) {
        List<BankAccount> accounts = accountRepository.findByUserId(userId);
        LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(6);
        
        long newAccounts = accounts.stream()
            .filter(acc -> acc.getCreatedAt().isAfter(sixMonthsAgo))
            .count();
        
        return Math.max(0, 100 - (int)newAccounts * 20);
    }
    
    private CreditScore.CreditRating determineCreditRating(int score) {
        if (score >= 800) return CreditScore.CreditRating.EXCELLENT;
        if (score >= 750) return CreditScore.CreditRating.VERY_GOOD;
        if (score >= 700) return CreditScore.CreditRating.GOOD;
        if (score >= 650) return CreditScore.CreditRating.FAIR;
        if (score >= 600) return CreditScore.CreditRating.POOR;
        return CreditScore.CreditRating.VERY_POOR;
    }
}