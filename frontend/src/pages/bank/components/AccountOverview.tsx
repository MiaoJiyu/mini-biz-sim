import { BankAccount, CreditCard, UserInvestment, CreditScore } from '../../../services/bankService';
import { useState } from 'react';

interface AccountOverviewProps {
  accounts: BankAccount[];
  creditCards: CreditCard[];
  investments: UserInvestment[];
  creditScore: CreditScore | null;
  onRefresh: () => void;
}

const AccountOverview = ({ accounts, creditCards, investments, creditScore, onRefresh }: AccountOverviewProps) => {
  const [showScoreDetails, setShowScoreDetails] = useState(false);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalCreditUsed = creditCards.reduce((sum, card) => sum + card.usedLimit, 0);
  const totalCreditLimit = creditCards.reduce((sum, card) => sum + card.creditLimit, 0);
  const totalInvestment = investments.reduce((sum, inv) => sum + inv.currentAmount, 0);
  const totalInvestmentReturn = investments.reduce((sum, inv) => sum + inv.accumulatedReturn, 0);

  const getScoreColor = (score: number) => {
    if (score >= 800) return 'bg-green-500';
    if (score >= 700) return 'bg-blue-500';
    if (score >= 600) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreRating = (score: number) => {
    if (score >= 800) return '优秀';
    if (score >= 750) return '很好';
    if (score >= 700) return '良好';
    if (score >= 650) return '一般';
    if (score >= 600) return '较差';
    return '很差';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">账户概览</h2>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
        >
          刷新数据
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-100">账户余额</span>
            <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div className="text-3xl font-bold">¥{totalBalance.toLocaleString()}</div>
          <div className="text-sm text-blue-200 mt-1">{accounts.length} 个账户</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-100">信用额度</span>
            <svg className="w-6 h-6 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div className="text-3xl font-bold">¥{totalCreditUsed.toLocaleString()}</div>
          <div className="text-sm text-purple-200 mt-1">可用 ¥{totalCreditLimit.toLocaleString()}</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-100">投资金额</span>
            <svg className="w-6 h-6 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="text-3xl font-bold">¥{totalInvestment.toLocaleString()}</div>
          <div className="text-sm text-green-200 mt-1">收益 ¥{totalInvestmentReturn.toLocaleString()}</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-orange-100">信用评分</span>
            <svg className="w-6 h-6 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold">{creditScore?.score || 'N/A'}</div>
          <div className="text-sm text-orange-200 mt-1">{creditScore ? getScoreRating(creditScore.score) : '暂无评分'}</div>
        </div>
      </div>

      {/* 详细信息 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 账户列表 */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">银行账户</h3>
          <div className="space-y-3">
            {accounts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">暂无账户</p>
            ) : (
              accounts.map(account => (
                <div key={account.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-800">
                      {account.accountType === 'SAVINGS' ? '储蓄账户' : 
                       account.accountType === 'CURRENT' ? '活期账户' : 
                       account.accountType === 'FIXED_DEPOSIT' ? '定期存款' : '投资账户'}
                    </span>
                    <span className="text-sm text-gray-500">{account.accountNumber}</span>
                  </div>
                  <div className="text-xl font-bold text-blue-600">¥{account.balance.toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 信用卡 */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">信用卡</h3>
          <div className="space-y-3">
            {creditCards.length === 0 ? (
              <p className="text-gray-500 text-center py-4">暂无信用卡</p>
            ) : (
              creditCards.map(card => (
                <div key={card.id} className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{card.cardNumber}</span>
                    <span className="text-sm">{card.cardHolder}</span>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <div className="text-sm text-purple-200">已用额度</div>
                      <div className="text-lg font-bold">¥{card.usedLimit.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-purple-200">可用额度</div>
                      <div className="text-lg font-bold">¥{card.availableLimit.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 投资组合 */}
      {investments.length > 0 && (
        <div className="mt-6 bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">投资组合</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {investments.map(investment => (
              <div key={investment.id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="font-medium text-gray-800 mb-2">{investment.productName}</div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">投资金额</span>
                  <span className="font-medium">¥{investment.investmentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">当前金额</span>
                  <span className="font-medium text-green-600">¥{investment.currentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">累积收益</span>
                  <span className={`font-medium ${investment.accumulatedReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {investment.accumulatedReturn >= 0 ? '+' : ''}¥{investment.accumulatedReturn.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountOverview;
