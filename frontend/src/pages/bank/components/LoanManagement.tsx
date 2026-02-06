import React, { useState } from 'react';
import { Loan, BankService } from '../../../services/bankService';

interface LoanManagementProps {
  loans: Loan[];
  onLoanApplied: (loan: Loan) => void;
  onRefresh: () => void;
}

const LoanManagement: React.FC<LoanManagementProps> = ({ loans, onLoanApplied, onRefresh }) => {
  const [showApplyLoan, setShowApplyLoan] = useState(false);
  const [selectedLoanType, setSelectedLoanType] = useState<Loan['loanType']>('PERSONAL');
  const [amount, setAmount] = useState('');
  const [termMonths, setTermMonths] = useState('12');
  const [purpose, setPurpose] = useState('');
  const [processing, setProcessing] = useState(false);

  const activeLoans = loans.filter(loan => 
    loan.status === 'ACTIVE' || loan.status === 'DELINQUENT'
  );
  const pendingLoans = loans.filter(loan => loan.status === 'PENDING');
  const completedLoans = loans.filter(loan => 
    loan.status === 'PAID_OFF' || loan.status === 'DEFAULTED'
  );

  const loanRates = {
    'PERSONAL': 6.5,
    'BUSINESS': 8.0,
    'MORTGAGE': 4.5,
    'LEVERAGE': 12.0,
    'EDUCATION': 5.0
  };

  const calculateMonthlyPayment = () => {
    if (!amount || !termMonths) return 0;
    
    const principal = parseFloat(amount);
    const annualRate = loanRates[selectedLoanType];
    const months = parseInt(termMonths);
    
    if (principal <= 0 || months <= 0) return 0;
    
    const monthlyRate = annualRate / 1200;
    const numerator = monthlyRate * principal;
    const denominator = 1 - Math.pow(1 + monthlyRate, -months);
    
    return numerator / denominator;
  };

  const handleApplyLoan = async () => {
    if (!amount || !termMonths || !purpose || processing) return;
    
    const numAmount = parseFloat(amount);
    if (numAmount <= 0) {
      alert('贷款金额必须大于零');
      return;
    }

    try {
      setProcessing(true);
      const application = {
        loanType: selectedLoanType,
        amount: numAmount,
        interestRate: loanRates[selectedLoanType],
        termMonths: parseInt(termMonths),
        purpose
      };
      
      const newLoan = await BankService.applyForLoan(application);
      onLoanApplied(newLoan);
      
      setAmount('');
      setTermMonths('12');
      setPurpose('');
      setShowApplyLoan(false);
      
      alert(newLoan.status === 'APPROVED' ? '贷款申请已批准！' : '贷款申请正在审核中');
    } catch (error: any) {
      console.error('贷款申请失败:', error);
      alert(error.response?.data?.message || '贷款申请失败，请稍后重试');
    } finally {
      setProcessing(false);
    }
  };

  const handleRepayLoan = async (loanId: number, amount: number) => {
    try {
      await BankService.repayLoan(loanId, amount);
      alert('还款成功！');
      onRefresh();
    } catch (error: any) {
      console.error('还款失败:', error);
      alert(error.response?.data?.message || '还款失败，请稍后重试');
    }
  };

  const monthlyPayment = calculateMonthlyPayment();

  return (
    <div className="space-y-6">
      {/* 贷款申请按钮 */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">贷款管理</h2>
            <p className="text-gray-600 mt-1">申请贷款或管理现有贷款</p>
          </div>
          <button
            onClick={() => setShowApplyLoan(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            💰 申请贷款
          </button>
        </div>
      </div>

      {/* 活跃贷款 */}
      {activeLoans.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">活跃贷款</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {activeLoans.map(loan => (
                <div key={loan.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">
                        {BankService.getLoanTypeName(loan.loanType)}
                      </h4>
                      <p className="text-sm text-gray-500">贷款 #{loan.id}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${BankService.getStatusColor(loan.status)}`}>
                      {loan.status === 'ACTIVE' ? '正常' : '逾期'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">贷款金额:</span>
                      <p className="font-semibold">{BankService.formatCurrency(loan.principalAmount)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">剩余金额:</span>
                      <p className="font-semibold">{BankService.formatCurrency(loan.remainingAmount)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">月供:</span>
                      <p className="font-semibold">{BankService.formatCurrency(loan.monthlyPayment)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">剩余期数:</span>
                      <p className="font-semibold">{loan.remainingMonths} 个月</p>
                    </div>
                  </div>
                  
                  {loan.nextPaymentDate && (
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        下次还款日: {new Date(loan.nextPaymentDate).toLocaleDateString('zh-CN')}
                      </span>
                      <button
                        onClick={() => handleRepayLoan(loan.id, loan.monthlyPayment)}
                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                      >
                        立即还款
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 申请贷款模态框 */}
      {showApplyLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">申请贷款</h3>
              
              <div className="space-y-4">
                {/* 贷款类型 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    贷款类型
                  </label>
                  <select
                    value={selectedLoanType}
                    onChange={(e) => setSelectedLoanType(e.target.value as Loan['loanType'])}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PERSONAL">个人贷款 (年利率 6.5%)</option>
                    <option value="BUSINESS">商业贷款 (年利率 8.0%)</option>
                    <option value="MORTGAGE">抵押贷款 (年利率 4.5%)</option>
                    <option value="LEVERAGE">杠杆贷款 (年利率 12.0%)</option>
                    <option value="EDUCATION">教育贷款 (年利率 5.0%)</option>
                  </select>
                </div>

                {/* 贷款金额 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    贷款金额 (¥)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="请输入贷款金额"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 贷款期限 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    贷款期限 (月)
                  </label>
                  <select
                    value={termMonths}
                    onChange={(e) => setTermMonths(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="6">6个月</option>
                    <option value="12">12个月</option>
                    <option value="24">24个月</option>
                    <option value="36">36个月</option>
                    <option value="60">60个月</option>
                  </select>
                </div>

                {/* 贷款用途 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    贷款用途
                  </label>
                  <textarea
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="请简要说明贷款用途"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 贷款计算器 */}
                {amount && termMonths && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-3">贷款详情</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>贷款金额:</span>
                        <span>{BankService.formatCurrency(parseFloat(amount))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>年利率:</span>
                        <span>{loanRates[selectedLoanType]}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>贷款期限:</span>
                        <span>{termMonths} 个月</span>
                      </div>
                      <div className="flex justify-between">
                        <span>月供:</span>
                        <span className="font-semibold">
                          {BankService.formatCurrency(monthlyPayment)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>总利息:</span>
                        <span>
                          {BankService.formatCurrency(monthlyPayment * parseInt(termMonths) - parseFloat(amount))}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowApplyLoan(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleApplyLoan}
                  disabled={!amount || !termMonths || !purpose || processing}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {processing ? '申请中...' : '提交申请'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanManagement;