import React, { useState } from 'react';
import { BankAccount, BankService } from '../../../services/bankService';

interface TransactionPanelProps {
  accounts: BankAccount[];
  onTransactionCompleted: () => void;
}

const TransactionPanel: React.FC<TransactionPanelProps> = ({ accounts, onTransactionCompleted }) => {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleTransaction = async () => {
    if (!selectedAccount || !amount || processing) return;
    
    const numAmount = parseFloat(amount);
    if (numAmount <= 0) {
      alert('金额必须大于零');
      return;
    }

    try {
      setProcessing(true);
      
      if (activeTab === 'deposit') {
        await BankService.deposit(selectedAccount, numAmount);
        alert('存款成功！');
      } else {
        await BankService.withdraw(selectedAccount, numAmount);
        alert('取款成功！');
      }
      
      setAmount('');
      onTransactionCompleted();
    } catch (error: any) {
      console.error('交易失败:', error);
      alert(error.response?.data?.message || '操作失败，请稍后重试');
    } finally {
      setProcessing(false);
    }
  };

  const activeAccounts = accounts.filter(account => account.isActive);

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* 标签页切换 */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`flex-1 py-4 text-center font-medium ${
              activeTab === 'deposit'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            💰 存款
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 py-4 text-center font-medium ${
              activeTab === 'withdraw'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            💳 取款
          </button>
        </div>

        {/* 交易表单 */}
        <div className="p-6">
          {activeAccounts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🏦</div>
              <p className="text-gray-500">您还没有活跃的银行账户</p>
              <p className="text-sm text-gray-400 mt-2">请先开立账户再进行交易</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {/* 选择账户 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    选择账户
                  </label>
                  <select
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">请选择账户</option>
                    {activeAccounts.map(account => (
                      <option key={account.id} value={account.accountNumber}>
                        {BankService.getAccountTypeName(account.accountType)} - {account.accountNumber}
                        (余额: {BankService.formatCurrency(account.balance)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 输入金额 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activeTab === 'deposit' ? '存款金额' : '取款金额'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">¥</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* 交易信息 */}
                {selectedAccount && amount && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">交易详情</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>交易类型:</span>
                        <span>{activeTab === 'deposit' ? '存款' : '取款'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>交易金额:</span>
                        <span>{BankService.formatCurrency(parseFloat(amount))}</span>
                      </div>
                      {activeTab === 'withdraw' && (
                        <div className="flex justify-between">
                          <span>手续费 (1%):</span>
                          <span>{BankService.formatCurrency(parseFloat(amount) * 0.01)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-medium">
                        <span>实际{activeTab === 'deposit' ? '存入' : '支出'}:</span>
                        <span>
                          {activeTab === 'deposit' 
                            ? BankService.formatCurrency(parseFloat(amount))
                            : BankService.formatCurrency(parseFloat(amount) * 1.01)
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 操作按钮 */}
              <button
                onClick={handleTransaction}
                disabled={!selectedAccount || !amount || processing}
                className={`w-full mt-6 py-3 rounded-lg font-medium ${
                  activeTab === 'deposit'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {processing ? '处理中...' : activeTab === 'deposit' ? '确认存款' : '确认取款'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* 交易说明 */}
      <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-3">交易说明</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start">
            <span className="text-green-500 mr-2">•</span>
            <span><strong>存款</strong>: 将资金存入银行账户，享受利息收益</span>
          </div>
          <div className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            <span><strong>取款</strong>: 从账户提取资金，收取1%的手续费</span>
          </div>
          <div className="flex items-start">
            <span className="text-yellow-500 mr-2">•</span>
            <span><strong>利息计算</strong>: 每日凌晨2点自动计算利息</span>
          </div>
          <div className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            <span><strong>安全提示</strong>: 请妥善保管账户信息，避免泄露</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionPanel;