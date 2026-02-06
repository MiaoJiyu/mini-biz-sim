import React, { useState } from 'react';
import { BankAccount, BankService } from '../../../services/bankService';

interface TransferPanelProps {
  accounts: BankAccount[];
  onTransferCompleted: () => void;
}

const TransferPanel: React.FC<TransferPanelProps> = ({ accounts, onTransferCompleted }) => {
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleTransfer = async () => {
    if (!fromAccount || !toAccount || !amount || processing) return;
    
    const numAmount = parseFloat(amount);
    if (numAmount <= 0) {
      alert('转账金额必须大于零');
      return;
    }

    if (fromAccount === toAccount) {
      alert('不能向自己转账');
      return;
    }

    try {
      setProcessing(true);
      await BankService.transfer(fromAccount, toAccount, numAmount);
      
      setAmount('');
      setMemo('');
      onTransferCompleted();
      
      alert('转账成功！');
    } catch (error: any) {
      console.error('转账失败:', error);
      alert(error.response?.data?.message || '转账失败，请稍后重试');
    } finally {
      setProcessing(false);
    }
  };

  const activeAccounts = accounts.filter(account => account.isActive);
  const selectedFromAccount = activeAccounts.find(acc => acc.accountNumber === fromAccount);
  const transferFee = amount ? parseFloat(amount) * 0.005 : 0;
  const totalAmount = amount ? parseFloat(amount) + transferFee : 0;

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">转账汇款</h2>
          
          {activeAccounts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🏦</div>
              <p className="text-gray-500">您还没有活跃的银行账户</p>
              <p className="text-sm text-gray-400 mt-2">请先开立账户再进行转账</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 转出账户 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  转出账户
                </label>
                <select
                  value={fromAccount}
                  onChange={(e) => setFromAccount(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">请选择转出账户</option>
                  {activeAccounts.map(account => (
                    <option key={account.id} value={account.accountNumber}>
                      {BankService.getAccountTypeName(account.accountType)} - {account.accountNumber}
                      (余额: {BankService.formatCurrency(account.balance)})
                    </option>
                  ))}
                </select>
              </div>

              {/* 转入账户 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  转入账户
                </label>
                <input
                  type="text"
                  value={toAccount}
                  onChange={(e) => setToAccount(e.target.value)}
                  placeholder="请输入对方账户号码"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 转账金额 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  转账金额
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

              {/* 备注 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  转账备注 (可选)
                </label>
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="请输入转账用途说明"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 转账详情 */}
              {fromAccount && toAccount && amount && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">转账详情</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>转出账户:</span>
                      <span className="font-mono">{fromAccount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>转入账户:</span>
                      <span className="font-mono">{toAccount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>转账金额:</span>
                      <span>{BankService.formatCurrency(parseFloat(amount))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>手续费 (0.5%):</span>
                      <span>{BankService.formatCurrency(transferFee)}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>实际支出:</span>
                      <span>{BankService.formatCurrency(totalAmount)}</span>
                    </div>
                    {selectedFromAccount && (
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>转账后余额:</span>
                        <span>
                          {BankService.formatCurrency(selectedFromAccount.balance - totalAmount)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 操作按钮 */}
              <button
                onClick={handleTransfer}
                disabled={!fromAccount || !toAccount || !amount || processing}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? '处理中...' : '确认转账'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 转账说明 */}
      <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-3">转账说明</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            <span><strong>手续费</strong>: 转账金额的0.5%，最低1元</span>
          </div>
          <div className="flex items-start">
            <span className="text-green-500 mr-2">•</span>
            <span><strong>到账时间</strong>: 实时到账，即时处理</span>
          </div>
          <div className="flex items-start">
            <span className="text-yellow-500 mr-2">•</span>
            <span><strong>限额</strong>: 单笔转账最高10万元，日累计100万元</span>
          </div>
          <div className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            <span><strong>安全提示</strong>: 请仔细核对对方账户信息，转账后无法撤销</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferPanel;