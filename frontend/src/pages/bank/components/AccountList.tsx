import { BankAccount } from '../../../services/bankService';
import { useState } from 'react';

interface AccountListProps {
  accounts: BankAccount[];
  onDeposit: (accountNumber: string, amount: number) => void;
  onWithdraw: (accountNumber: string, amount: number) => void;
  onTransfer: (fromAccount: string, toAccount: string, amount: number) => void;
  onRefresh: () => void;
}

const AccountList = ({ accounts, onDeposit, onWithdraw, onTransfer, onRefresh }: AccountListProps) => {
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [action, setAction] = useState<'deposit' | 'withdraw' | 'transfer' | null>(null);
  const [amount, setAmount] = useState('');
  const [targetAccount, setTargetAccount] = useState('');

  const handleAction = () => {
    if (!selectedAccount || !amount) return;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('请输入有效的金额');
      return;
    }

    if (action === 'deposit') {
      onDeposit(selectedAccount.accountNumber, numAmount);
    } else if (action === 'withdraw') {
      if (numAmount > selectedAccount.availableBalance) {
        alert('余额不足');
        return;
      }
      onWithdraw(selectedAccount.accountNumber, numAmount);
    } else if (action === 'transfer') {
      if (!targetAccount) {
        alert('请输入目标账户');
        return;
      }
      if (numAmount > selectedAccount.availableBalance) {
        alert('余额不足');
        return;
      }
      onTransfer(selectedAccount.accountNumber, targetAccount, numAmount);
    }

    setAmount('');
    setTargetAccount('');
    setAction(null);
    setSelectedAccount(null);
  };

  const getAccountTypeName = (type: string) => {
    switch (type) {
      case 'SAVINGS': return '储蓄账户';
      case 'CURRENT': return '活期账户';
      case 'FIXED_DEPOSIT': return '定期存款';
      case 'INVESTMENT': return '投资账户';
      default: return type;
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'SAVINGS': return 'from-blue-500 to-blue-600';
      case 'CURRENT': return 'from-green-500 to-green-600';
      case 'FIXED_DEPOSIT': return 'from-purple-500 to-purple-600';
      case 'INVESTMENT': return 'from-orange-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">账户管理</h2>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
        >
          刷新数据
        </button>
      </div>

      {/* 账户列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {accounts.map(account => (
          <div
            key={account.id}
            className={`bg-gradient-to-br ${getAccountTypeColor(account.accountType)} rounded-xl p-6 text-white shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300`}
            onClick={() => setSelectedAccount(account)}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">{getAccountTypeName(account.accountType)}</span>
              <span className="text-sm opacity-80">{account.accountNumber}</span>
            </div>
            <div className="text-3xl font-bold mb-2">¥{account.balance.toLocaleString()}</div>
            <div className="text-sm opacity-80">可用余额: ¥{account.availableBalance.toLocaleString()}</div>
            {account.interestRate && (
              <div className="text-sm opacity-80 mt-1">年利率: {account.interestRate}%</div>
            )}
          </div>
        ))}
      </div>

      {/* 操作面板 */}
      {selectedAccount && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            操作 - {selectedAccount.accountNumber}
          </h3>

          {!action ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setAction('deposit')}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                存款
              </button>

              <button
                onClick={() => setAction('withdraw')}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
                取款
              </button>

              <button
                onClick={() => setAction('transfer')}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                转账
              </button>
            </div>
          ) : (
            <div className="max-w-md">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">金额</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="输入金额"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {action === 'transfer' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">目标账户</label>
                  <input
                    type="text"
                    value={targetAccount}
                    onChange={(e) => setTargetAccount(e.target.value)}
                    placeholder="输入目标账户号码"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleAction}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  确认{action === 'deposit' ? '存款' : action === 'withdraw' ? '取款' : '转账'}
                </button>
                <button
                  onClick={() => {
                    setAction(null);
                    setAmount('');
                    setTargetAccount('');
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300"
                >
                  取消
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountList;
