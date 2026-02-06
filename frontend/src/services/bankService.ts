import axios from 'axios';

const BANK_SERVICE_URL = import.meta.env.VITE_BANK_SERVICE_URL || 'http://localhost:8083/api/bank';

export interface BankAccount {
  id: number;
  userId: string;
  accountNumber: string;
  accountType: 'SAVINGS' | 'CURRENT' | 'FIXED_DEPOSIT' | 'INVESTMENT' | 'CREDIT_CARD';
  balance: number;
  availableBalance: number;
  interestRate: number;
  createdAt: string;
  isActive: boolean;
}

export interface CreditCard {
  id: number;
  userId: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: number;
  creditLimit: number;
  usedLimit: number;
  availableLimit: number;
  interestRate: number;
  latePaymentFee: number;
  billingCycleStart: string;
  billingCycleEnd: string;
  paymentDueDate: string;
  currentBalance: number;
  minimumPayment: number;
  status: 'ACTIVE' | 'FROZEN' | 'CANCELLED' | 'BLOCKED';
}

export interface InvestmentProduct {
  id: number;
  productCode: string;
  productName: string;
  productType: 'FIXED_INCOME' | 'FUND' | 'STRUCTURED' | 'HYBRID';
  minInvestmentAmount: number;
  maxInvestmentAmount: number;
  expectedReturnRate: number;
  riskLevel: number;
  termDays: number;
  earlyWithdrawalPenalty: number;
  description: string;
  status: 'AVAILABLE' | 'SOLD_OUT' | 'SUSPENDED' | 'TERMINATED';
}

export interface UserInvestment {
  id: number;
  userId: string;
  productId: number;
  productName: string;
  investmentAmount: number;
  currentAmount: number;
  accumulatedReturn: number;
  status: 'ACTIVE' | 'MATURED' | 'WITHDRAWN' | 'FORFEITED';
  purchaseDate: string;
  maturityDate: string;
}

export interface Transaction {
  id: number;
  fromAccountNumber: string;
  toAccountNumber: string;
  type: string;
  amount: number;
  fee: number;
  balanceAfter: number;
  transactionTime: string;
  description: string;
  referenceNumber: string;
  status: string;
}

export interface CreditScore {
  id: number;
  userId: string;
  score: number;
  rating: 'EXCELLENT' | 'VERY_GOOD' | 'GOOD' | 'FAIR' | 'POOR' | 'VERY_POOR';
  lastUpdated: string;
  paymentHistory: number;
  creditUtilization: number;
  creditAge: number;
  creditMix: number;
  newCredit: number;
}

export interface Loan {
  id: number;
  userId: string;
  loanType: string;
  principalAmount: number;
  remainingAmount: number;
  interestRate: number;
  termMonths: number;
  remainingMonths: number;
  monthlyPayment: number;
  status: string;
  createdAt: string;
  approvedAt: string;
  nextPaymentDate: string;
}

// 账户管理
export const createAccount = async (userId: string, accountType: string): Promise<BankAccount> => {
  const response = await axios.post(
    `${BANK_SERVICE_URL}/accounts`,
    { accountType },
    {
      headers: { 'X-User-Id': userId }
    }
  );
  return response.data;
};

export const getUserAccounts = async (userId: string): Promise<BankAccount[]> => {
  const response = await axios.get(`${BANK_SERVICE_URL}/accounts`, {
    headers: { 'X-User-Id': userId }
  });
  return response.data;
};

export const getAccountBalance = async (accountNumber: string): Promise<number> => {
  const response = await axios.get(`${BANK_SERVICE_URL}/accounts/${accountNumber}/balance`);
  return response.data;
};

export const deposit = async (accountNumber: string, amount: number): Promise<Transaction> => {
  const response = await axios.post(
    `${BANK_SERVICE_URL}/accounts/${accountNumber}/deposit`,
    null,
    { params: { amount } }
  );
  return response.data;
};

export const withdraw = async (accountNumber: string, amount: number): Promise<Transaction> => {
  const response = await axios.post(
    `${BANK_SERVICE_URL}/accounts/${accountNumber}/withdraw`,
    null,
    { params: { amount } }
  );
  return response.data;
};

export const transfer = async (fromAccount: string, toAccount: string, amount: number): Promise<Transaction> => {
  const response = await axios.post(
    `${BANK_SERVICE_URL}/transfer`,
    null,
    { params: { fromAccount, toAccount, amount } }
  );
  return response.data;
};

export const getTransactionHistory = async (accountNumber: string, days: number = 30): Promise<Transaction[]> => {
  const response = await axios.get(
    `${BANK_SERVICE_URL}/accounts/${accountNumber}/transactions`,
    { params: { days } }
  );
  return response.data;
};

// 信用卡管理
export const applyForCreditCard = async (userId: string, cardHolder: string): Promise<CreditCard> => {
  const response = await axios.post(
    `${BANK_SERVICE_URL}/credit-cards`,
    null,
    {
      params: { cardHolder },
      headers: { 'X-User-Id': userId }
    }
  );
  return response.data;
};

export const getUserCreditCards = async (userId: string): Promise<CreditCard[]> => {
  const response = await axios.get(`${BANK_SERVICE_URL}/credit-cards`, {
    headers: { 'X-User-Id': userId }
  });
  return response.data;
};

export const creditCardPayment = async (cardNumber: string, amount: number): Promise<Transaction> => {
  const response = await axios.post(
    `${BANK_SERVICE_URL}/credit-cards/${cardNumber}/payment`,
    null,
    { params: { amount } }
  );
  return response.data;
};

export const useCreditCard = async (cardNumber: string, amount: number): Promise<CreditCard> => {
  const response = await axios.post(
    `${BANK_SERVICE_URL}/credit-cards/${cardNumber}/purchase`,
    null,
    { params: { amount } }
  );
  return response.data;
};

// 理财产品管理
export const getAvailableProducts = async (): Promise<InvestmentProduct[]> => {
  const response = await axios.get(`${BANK_SERVICE_URL}/investment-products`);
  return response.data;
};

export const getUserInvestments = async (userId: string): Promise<UserInvestment[]> => {
  const response = await axios.get(`${BANK_SERVICE_URL}/investments`, {
    headers: { 'X-User-Id': userId }
  });
  return response.data;
};

export const purchaseProduct = async (userId: string, productCode: string, amount: number): Promise<UserInvestment> => {
  const response = await axios.post(
    `${BANK_SERVICE_URL}/investments/purchase`,
    null,
    {
      params: { productCode, amount },
      headers: { 'X-User-Id': userId }
    }
  );
  return response.data;
};

export const redeemInvestment = async (investmentId: number): Promise<UserInvestment> => {
  const response = await axios.post(`${BANK_SERVICE_URL}/investments/${investmentId}/redeem`);
  return response.data;
};

// 信用评分
export const getCreditScore = async (userId: string): Promise<CreditScore> => {
  const response = await axios.get(`${BANK_SERVICE_URL}/credit-score`, {
    headers: { 'X-User-Id': userId }
  });
  return response.data;
};

export const updateCreditScore = async (userId: string): Promise<void> => {
  await axios.post(`${BANK_SERVICE_URL}/credit-score/update`, null, {
    headers: { 'X-User-Id': userId }
  });
};

// 总资产查询
export const getTotalAssets = async (userId: string): Promise<number> => {
  const response = await axios.get(`${BANK_SERVICE_URL}/accounts/total-assets`, {
    headers: { 'X-User-Id': userId }
  });
  return response.data;
};
