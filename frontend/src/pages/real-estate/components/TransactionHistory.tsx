import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { PropertyTransaction, realEstateService } from '../../../services/realEstateService';

interface TransactionHistoryProps {
  userId: string;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ userId }) => {
  const [transactions, setTransactions] = useState<PropertyTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, [userId]);

  const loadTransactions = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const data = await realEstateService.getUserTransactionHistory(userId);
      // 按时间倒序排列
      const sortedTransactions = data.sort((a, b) => 
        new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
      );
      setTransactions(sortedTransactions);
    } catch (error) {
      console.error('加载交易历史失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'PURCHASE': return 'bg-green-100 text-green-800';
      case 'SALE': return 'bg-red-100 text-red-800';
      case 'RENT': return 'bg-blue-100 text-blue-800';
      case 'RENT_CANCELLATION': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'PURCHASE': return '购买';
      case 'SALE': return '出售';
      case 'RENT': return '租赁';
      case 'RENT_CANCELLATION': return '取消租赁';
      default: return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载交易历史中...</p>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <i className="fas fa-history text-4xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-semibold text-gray-600">暂无交易记录</h3>
          <p className="text-gray-500 mt-2">您还没有进行过房地产交易</p>
        </CardContent>
      </Card>
    );
  }

  // 计算统计信息
  const stats = {
    totalTransactions: transactions.length,
    totalSpent: transactions
      .filter(t => t.type === 'PURCHASE')
      .reduce((sum, t) => sum + t.totalAmount!, 0),
    totalEarned: transactions
      .filter(t => t.type === 'SALE' || t.type === 'RENT')
      .reduce((sum, t) => sum + t.totalAmount!, 0),
    purchaseCount: transactions.filter(t => t.type === 'PURCHASE').length,
    saleCount: transactions.filter(t => t.type === 'SALE').length,
    rentCount: transactions.filter(t => t.type === 'RENT').length
  };

  return (
    <div className="space-y-6">
      {/* 交易统计 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">总交易数</p>
                <p className="text-2xl font-bold">{stats.totalTransactions}</p>
              </div>
              <i className="fas fa-exchange-alt text-blue-600 text-xl"></i>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">总支出</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(stats.totalSpent)}
                </p>
              </div>
              <i className="fas fa-arrow-down text-red-600 text-xl"></i>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">总收入</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalEarned)}
                </p>
              </div>
              <i className="fas fa-arrow-up text-green-600 text-xl"></i>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 交易类型分布 */}
      <Card>
        <CardHeader>
          <CardTitle>交易类型分布</CardTitle>
          <CardDescription>您的房地产交易类型统计</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.purchaseCount}</div>
              <div className="text-sm text-gray-600">购买交易</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.saleCount}</div>
              <div className="text-sm text-gray-600">出售交易</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.rentCount}</div>
              <div className="text-sm text-gray-600">租赁交易</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 交易记录列表 */}
      <Card>
        <CardHeader>
          <CardTitle>交易记录</CardTitle>
          <CardDescription>按时间顺序显示您的所有房地产交易</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'PURCHASE' ? 'bg-green-100 text-green-600' :
                    transaction.type === 'SALE' ? 'bg-red-100 text-red-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {transaction.type === 'PURCHASE' && <i className="fas fa-shopping-cart"></i>}
                    {transaction.type === 'SALE' && <i className="fas fa-money-bill-wave"></i>}
                    {transaction.type === 'RENT' && <i className="fas fa-key"></i>}
                    {transaction.type === 'RENT_CANCELLATION' && <i className="fas fa-times"></i>}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold">{transaction.property.name}</h4>
                      <Badge className={getTransactionTypeColor(transaction.type)}>
                        {getTransactionTypeLabel(transaction.type)}
                      </Badge>
                      {transaction.rentalDuration && (
                        <Badge variant="outline">{transaction.rentalDuration}个月</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {transaction.property.city.name} · {transaction.property.location}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(transaction.transactionDate)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    transaction.type === 'PURCHASE' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {transaction.type === 'PURCHASE' ? '-' : '+'}
                    {formatCurrency(transaction.transactionPrice)}
                  </div>
                  <div className="text-sm text-gray-500">
                    总额: {formatCurrency(transaction.totalAmount!)}
                  </div>
                  {transaction.transactionFee > 0 && (
                    <div className="text-xs text-gray-400">
                      手续费: {formatCurrency(transaction.transactionFee)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 交易分析 */}
      <Card>
        <CardHeader>
          <CardTitle>交易分析</CardTitle>
          <CardDescription>基于您的交易历史数据分析</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">投资回报分析</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>总投资额:</span>
                  <span className="font-medium">{formatCurrency(stats.totalSpent)}</span>
                </div>
                <div className="flex justify-between">
                  <span>总收益:</span>
                  <span className="font-medium text-green-600">{formatCurrency(stats.totalEarned)}</span>
                </div>
                <div className="flex justify-between">
                  <span>净收益:</span>
                  <span className={`font-bold ${
                    stats.totalEarned - stats.totalSpent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(stats.totalEarned - stats.totalSpent)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>投资回报率:</span>
                  <span className={`font-bold ${
                    stats.totalSpent > 0 ? (stats.totalEarned - stats.totalSpent) / stats.totalSpent >= 0 ? 'text-green-600' : 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stats.totalSpent > 0 
                      ? `${(((stats.totalEarned - stats.totalSpent) / stats.totalSpent) * 100).toFixed(2)}%`
                      : 'N/A'
                    }
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">交易频率分析</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>平均每月交易:</span>
                  <span className="font-medium">
                    {transactions.length > 0 
                      ? (transactions.length / Math.max(1, (new Date().getTime() - new Date(transactions[transactions.length - 1].transactionDate).getTime()) / (30 * 24 * 60 * 60 * 1000))).toFixed(1)
                      : '0'
                    } 次
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>首次交易:</span>
                  <span className="font-medium">
                    {transactions.length > 0 ? formatDate(transactions[transactions.length - 1].transactionDate) : '暂无'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>最近交易:</span>
                  <span className="font-medium">
                    {transactions.length > 0 ? formatDate(transactions[0].transactionDate) : '暂无'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>活跃度:</span>
                  <span className={`font-bold ${
                    transactions.length >= 10 ? 'text-green-600' : 
                    transactions.length >= 5 ? 'text-yellow-600' : 'text-gray-600'
                  }`}>
                    {transactions.length >= 10 ? '高' : 
                     transactions.length >= 5 ? '中' : '低'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionHistory;