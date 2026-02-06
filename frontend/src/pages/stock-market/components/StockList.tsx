import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StockQuote } from '@/services/stockService';
import { TrendingUp, TrendingDown, Minus, Star, Building2 } from 'lucide-react';

interface StockListProps {
  stocks: StockQuote[];
  selectedStock: StockQuote | null;
  onSelectStock: (stock: StockQuote) => void;
  isLoading: boolean;
}

export const StockList: React.FC<StockListProps> = ({
  stocks,
  selectedStock,
  onSelectStock,
  isLoading
}) => {
  // 格式化数字
  const formatNumber = (num: number): string => {
    if (num >= 100000000) {
      return (num / 100000000).toFixed(2) + '亿';
    } else if (num >= 10000) {
      return (num / 10000).toFixed(2) + '万';
    }
    return num.toString();
  };

  // 获取涨跌颜色
  const getChangeColor = (change: number): string => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  // 获取涨跌图标
  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />;
    if (change < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

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

  if (stocks.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">未找到相关股票</h3>
            <p className="text-gray-600">请尝试搜索其他关键词或刷新页面</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            股票列表 ({stocks.length} 只)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">代码</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">名称</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">行业</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">当前价</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">涨跌幅</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">涨跌额</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">成交量</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">市值</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => (
                  <tr 
                    key={stock.code}
                    onClick={() => onSelectStock(stock)}
                    className={`border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-blue-50/50 ${
                      selectedStock?.code === stock.code ? 'bg-blue-100/50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-blue-600">{stock.code}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{stock.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-[200px]">{stock.company}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {stock.industry}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-gray-900">
                      {stock.currentPrice.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className={`flex items-center justify-end gap-1 ${getChangeColor(stock.changePercent)}`}>
                        {getChangeIcon(stock.changePercent)}
                        <span className="font-medium">
                          {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-medium ${getChangeColor(stock.change)}`}>
                        {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-sm text-gray-600">
                      {formatNumber(stock.volume)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-sm text-gray-600">
                      {formatNumber(stock.marketCap)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 快捷操作栏 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">上涨股票</div>
                <div className="text-2xl font-bold text-green-600">
                  {stocks.filter(s => s.change > 0).length}
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">下跌股票</div>
                <div className="text-2xl font-bold text-red-600">
                  {stocks.filter(s => s.change < 0).length}
                </div>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">平盘股票</div>
                <div className="text-2xl font-bold text-blue-600">
                  {stocks.filter(s => s.change === 0).length}
                </div>
              </div>
              <Minus className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};