import { UserInvestment } from '../../../services/bankService';
import { useState } from 'react';

interface UserInvestmentsProps {
  investments: UserInvestment[];
  onRedeem: (investmentId: number) => void;
  onRefresh: () => void;
}

const UserInvestments = ({ investments, onRedeem, onRefresh }: UserInvestmentsProps) => {
  const [selectedInvestment, setSelectedInvestment] = useState<UserInvestment | null>(null);

  const handleRedeem = () => {
    if (!selectedInvestment) return;
    
    if (window.confirm(`确定要赎回 "${selectedInvestment.productName}" 吗？`)) {
      onRedeem(selectedInvestment.id);
      setSelectedInvestment(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN');
  };

  const getInvestmentStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-600 bg-green-50';
      case 'MATURED': return 'text-blue-600 bg-blue-50';
      case 'WITHDRAWN': return 'text-gray-600 bg-gray-50';
      case 'FORFEITED': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getInvestmentStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return '活跃中';
      case 'MATURED': return '已到期';
      case 'WITHDRAWN': return '已赎回';
      case 'FORFEITED': return '已放弃';
      default: return status;
    }
  };

  const totalInvestment = investments.reduce((sum, inv) => sum + inv.investmentAmount, 0);
  const totalCurrentAmount = investments.reduce((sum, inv) => sum + inv.currentAmount, 0);
  const totalReturn = investments.reduce((sum, inv) => sum + inv.accumulatedReturn, 0);
  const totalProfit = totalCurrentAmount - totalInvestment;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">我的投资</h2>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
        >
          刷新数据
        </button>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-blue-100 mb-2">总投资金额</div>
          <div className="text-3xl font-bold">¥{totalInvestment.toLocaleString()}</div>
          <div className="text-sm text-blue-200 mt-1">{investments.length} 个投资项目</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-green-100 mb-2">当前总金额</div>
          <div className="text-3xl font-bold">¥{totalCurrentAmount.toLocaleString()}</div>
          <div className="text-sm text-green-200 mt-1">累积收益 ¥{totalReturn.toLocaleString()}</div>
        </div>

        <div className={`bg-gradient-to-br ${totalProfit >= 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'} rounded-xl p-6 text-white shadow-lg`}>
          <div className={`${totalProfit >= 0 ? 'text-green-100' : 'text-red-100'} mb-2`}>
            {totalProfit >= 0 ? '总盈余' : '总亏损'}
          </div>
          <div className="text-3xl font-bold">
            {totalProfit >= 0 ? '+' : ''}¥{totalProfit.toLocaleString()}
          </div>
          <div className={`text-sm ${totalProfit >= 0 ? 'text-green-200' : 'text-red-200'} mt-1`}>
            收益率 {((totalProfit / totalInvestment) * 100).toFixed(2)}%
          </div>
        </div>
      </div>

      {/* 投资列表 */}
      {investments.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-gray-600 mb-4">您还没有投资任何理财产品</p>
          <button
            onClick={() => window.location.hash = '#investments'}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
          >
            浏览理财产品
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {investments.map(investment => {
            const profit = investment.currentAmount - investment.investmentAmount;
            const profitRate = (profit / investment.investmentAmount) * 100;

            return (
              <div
                key={investment.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{investment.productName}</h3>
                      <div className="text-sm text-gray-500 mt-1">
                        购买日期: {formatDate(investment.purchaseDate)}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getInvestmentStatusColor(investment.status)}`}>
                      {getInvestmentStatusText(investment.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">投资金额</div>
                      <div className="text-xl font-bold">¥{investment.investmentAmount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">当前金额</div>
                      <div className="text-xl font-bold text-green-600">¥{investment.currentAmount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">累积收益</div>
                      <div className={`text-xl font-bold ${investment.accumulatedReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {investment.accumulatedReturn >= 0 ? '+' : ''}¥{investment.accumulatedReturn.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">盈亏</div>
                      <div className={`text-xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {profit >= 0 ? '+' : ''}¥{profit.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      收益率: <span className={`font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {profit >= 0 ? '+' : ''}{profitRate.toFixed(2)}%
                      </span>
                    </div>

                    {investment.status === 'ACTIVE' && (
                      <button
                        onClick={() => setSelectedInvestment(investment)}
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                      >
                        赎回
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 赎回确认面板 */}
      {selectedInvestment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">确认赎回</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">产品名称</span>
                <span className="font-medium">{selectedInvestment.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">投资金额</span>
                <span className="font-medium">¥{selectedInvestment.investmentAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">当前金额</span>
                <span className="font-medium text-green-600">¥{selectedInvestment.currentAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">累积收益</span>
                <span className={`font-medium ${selectedInvestment.accumulatedReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedInvestment.accumulatedReturn >= 0 ? '+' : ''}¥{selectedInvestment.accumulatedReturn.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRedeem}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                确认赎回
              </button>
              <button
                onClick={() => setSelectedInvestment(null)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInvestments;
