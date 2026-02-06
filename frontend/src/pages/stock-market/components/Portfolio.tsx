import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPosition, StockService, TradeRecord } from '@/services/stockService';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Calendar, RefreshCw } from 'lucide-react';

export const Portfolio: React.FC = () => {
  const [positions, setPositions] = useState<UserPosition[]>([]);
  const [tradeHistory, setTradeHistory] = useState<TradeRecord[]>([]);
  const [totalAssets, setTotalAssets] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'positions' | 'history'>('positions');

  // 模拟当前用户ID（实际项目中应该从认证系统获取）
  const currentUserId = 'user-123';

  // 加载持仓和交易数据
  const loadPortfolioData = async () => {
    setIsLoading(true);
    try {
      const [positionsData, historyData, assetsData] = await Promise.all([
        StockService.getUserPositions(currentUserId),
        StockService.getTradeHistory(currentUserId, 30),
        StockService.getUserTotalAssets(currentUserId)
      ]);

      setPositions(positionsData.filter(p => p.quantity > 0));
      setTradeHistory(historyData);
      setTotalAssets(assetsData);
    } catch (error) {
      console.error('加载持仓数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolioData();
  }, []);

  // 计算总盈亏
  const totalProfitLoss = positions.reduce((sum, pos) => sum + pos.profitLoss, 0);
  
  // 计算总投资成本
  const totalInvestment = positions.reduce((sum, pos) => sum + (pos.averagePrice * pos.quantity), 0);
  
  // 计算总收益率
  const totalReturnRate = totalInvestment > 0 ? (totalProfitLoss / totalInvestment) * 100 : 0;

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">加载中...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 资产概览 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">总资产</div>
                <div className="text-2xl font-bold text-blue-600">
                  <DollarSign className="w-5 h-5 inline mr-1" />
                  {totalAssets.toFixed(2)}
                </div>
              </div>
              <PieChart className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">浮动盈亏</div>
                <div className={`text-2xl font-bold ${
                  totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {totalProfitLoss >= 0 ? '+' : ''}{totalProfitLoss.toFixed(2)}
                </div>
              </div>
              {totalProfitLoss >= 0 ? (
                <TrendingUp className="w-8 h-8 text-green-500" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-500" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">总收益率</div>
                <div className={`text-2xl font-bold ${
                  totalReturnRate >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {totalReturnRate >= 0 ? '+' : ''}{totalReturnRate.toFixed(2)}%
                </div>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 持仓和交易历史切换 */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Button
              variant={activeTab === 'positions' ? 'default' : 'outline'}
              onClick={() => setActiveTab('positions')}
              className="flex-1"
            >
              <PieChart className="w-4 h-4 mr-2" />
              持仓明细 ({positions.length})
            </Button>
            <Button
              variant={activeTab === 'history' ? 'default' : 'outline'}
              onClick={() => setActiveTab('history')}
              className="flex-1"
            >
              <Calendar className="w-4 h-4 mr-2" />
              交易记录 ({tradeHistory.length})
            </Button>
            <Button
              variant="outline"
              onClick={loadPortfolioData}
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 持仓明细 */}
      {activeTab === 'positions' && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-500" />
              持仓明细
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {positions.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无持仓</h3>
                <p className="text-gray-600">开始交易后，您的持仓将显示在这里</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/50">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">股票</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">持仓数量</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">平均成本</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">当前价格</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">当前市值</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">浮动盈亏</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">收益率</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((position) => {
                      const returnRate = ((position.profitLoss) / (position.averagePrice * position.quantity)) * 100;
                      return (
                        <tr key={position.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-gray-900">{position.stock.name}</div>
                              <div className="text-sm text-gray-500 font-mono">{position.stock.code}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-mono">{position.quantity}</td>
                          <td className="py-3 px-4 text-right font-mono">{position.averagePrice.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right font-mono">{position.stock.currentPrice.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right font-mono">{position.currentValue.toFixed(2)}</td>
                          <td className={`py-3 px-4 text-right font-mono ${
                            position.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {position.profitLoss >= 0 ? '+' : ''}{position.profitLoss.toFixed(2)}
                          </td>
                          <td className={`py-3 px-4 text-right font-mono ${
                            returnRate >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {returnRate >= 0 ? '+' : ''}{returnRate.toFixed(2)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 交易记录 */}
      {activeTab === 'history' && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              交易记录（最近30天）
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {tradeHistory.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无交易记录</h3>
                <p className="text-gray-600">开始交易后，您的交易记录将显示在这里</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/50">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">时间</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">股票</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">方向</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">数量</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">价格</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">总金额</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tradeHistory.map((trade) => (
                      <tr key={trade.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(trade.tradeTime).toLocaleString('zh-CN')}
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{trade.stock.name}</div>
                            <div className="text-sm text-gray-500 font-mono">{trade.stock.code}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            trade.tradeType === 'BUY' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {trade.tradeType === 'BUY' ? '买入' : '卖出'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono">{trade.quantity}</td>
                        <td className="py-3 px-4 text-right font-mono">{trade.price.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right font-mono">{trade.totalAmount.toFixed(2)}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            trade.status === 'COMPLETED' 
                              ? 'bg-green-100 text-green-800' 
                              : trade.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {trade.status === 'COMPLETED' ? '已完成' : 
                             trade.status === 'PENDING' ? '待处理' : '已取消'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 持仓分布图（简化版） */}
      {positions.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-500" />
              持仓分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {positions.map((position) => {
                const weight = (position.currentValue / totalAssets) * 100;
                return (
                  <div key={position.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-900">{position.stock.name}</span>
                        <span className="text-gray-600">{weight.toFixed(1)}%</span>
                      </div>
                      <div className="mt-1">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-full rounded-full ${
                              position.profitLoss >= 0 ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${weight}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};