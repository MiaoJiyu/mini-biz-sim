import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StockQuote, StockService } from '@/services/stockService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, BarChart3 } from 'lucide-react';

interface StockChartProps {
  stock: StockQuote | null;
  isLoading: boolean;
}

interface PriceData {
  timestamp: string;
  price: number;
  volume: number;
}

export const StockChart: React.FC<StockChartProps> = ({ stock, isLoading }) => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [timeRange, setTimeRange] = useState<'1d' | '1w' | '1m' | '3m'>('1d');
  const [chartType, setChartType] = useState<'line' | 'area'>('line');

  // 模拟价格数据（实际项目中应该从API获取）
  const generateMockData = (basePrice: number, days: number): PriceData[] => {
    const data: PriceData[] = [];
    const now = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // 模拟价格波动
      const volatility = 0.05; // 5%波动
      const randomChange = (Math.random() - 0.5) * 2 * volatility * basePrice;
      const price = basePrice + randomChange;
      
      data.push({
        timestamp: date.toISOString().split('T')[0],
        price: Math.max(price, 0.01), // 确保价格不为负
        volume: Math.floor(Math.random() * 1000000) + 100000
      });
    }
    
    return data;
  };

  // 加载价格数据
  useEffect(() => {
    if (!stock) return;

    const daysMap = {
      '1d': 1,
      '1w': 7,
      '1m': 30,
      '3m': 90
    };

    const mockData = generateMockData(stock.currentPrice, daysMap[timeRange]);
    setPriceData(mockData);
  }, [stock, timeRange]);

  if (!stock) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">请选择一只股票</h3>
            <p className="text-gray-600">在左侧股票列表中选择一只股票查看价格图表</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPositive = stock.change > 0;

  return (
    <div className="space-y-4">
      {/* 股票基本信息 */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{stock.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-blue-600 font-bold">{stock.code}</span>
                <span className="text-sm text-gray-500">{stock.company}</span>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                  {stock.industry}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                {stock.currentPrice.toFixed(2)}
              </div>
              <div className={`flex items-center justify-end gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="font-medium">
                  {isPositive ? '+' : ''}{stock.change.toFixed(2)} 
                  ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">开盘:</span>
              <span className="ml-2 font-medium">{stock.openPrice.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-gray-500">最高:</span>
              <span className="ml-2 font-medium text-green-600">{stock.highPrice.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-gray-500">最低:</span>
              <span className="ml-2 font-medium text-red-600">{stock.lowPrice.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-gray-500">成交量:</span>
              <span className="ml-2 font-medium">{(stock.volume / 10000).toFixed(0)}万</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 图表控制栏 */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">时间范围:</span>
              <div className="flex gap-1">
                {(['1d', '1w', '1m', '3m'] as const).map((range) => (
                  <Button
                    key={range}
                    variant={timeRange === range ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeRange(range)}
                    className={`text-xs ${
                      timeRange === range 
                        ? 'bg-blue-600 text-white' 
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {range === '1d' ? '1日' : range === '1w' ? '1周' : range === '1m' ? '1月' : '3月'}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">图表类型:</span>
              <div className="flex gap-1">
                <Button
                  variant={chartType === 'line' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setChartType('line')}
                  className={`text-xs ${
                    chartType === 'line' 
                      ? 'bg-blue-600 text-white' 
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  折线图
                </Button>
                <Button
                  variant={chartType === 'area' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setChartType('area')}
                  className={`text-xs ${
                    chartType === 'area' 
                      ? 'bg-blue-600 text-white' 
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  面积图
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 价格图表 */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            {stock.name} 价格走势
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="#666" 
                    fontSize={12}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return timeRange === '1d' 
                        ? date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
                        : date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
                    }}
                  />
                  <YAxis 
                    stroke="#666" 
                    fontSize={12}
                    domain={['dataMin - 1', 'dataMax + 1']}
                    tickFormatter={(value) => value.toFixed(2)}
                  />
                  <Tooltip
                    formatter={(value: number) => [value.toFixed(2), '价格']}
                    labelFormatter={(label) => `时间: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke={isPositive ? '#10b981' : '#ef4444'} 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                </LineChart>
              ) : (
                <AreaChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="#666" 
                    fontSize={12}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return timeRange === '1d' 
                        ? date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
                        : date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
                    }}
                  />
                  <YAxis 
                    stroke="#666" 
                    fontSize={12}
                    domain={['dataMin - 1', 'dataMax + 1']}
                    tickFormatter={(value) => value.toFixed(2)}
                  />
                  <Tooltip
                    formatter={(value: number) => [value.toFixed(2), '价格']}
                    labelFormatter={(label) => `时间: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    fill={isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}
                    stroke={isPositive ? '#10b981' : '#ef4444'} 
                    strokeWidth={2}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 技术指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">波动率</div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.abs(stock.changePercent).toFixed(2)}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">市值</div>
              <div className="text-2xl font-bold text-green-600">
                {(stock.marketCap / 100000000).toFixed(2)}亿
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">交易活跃度</div>
              <div className="text-2xl font-bold text-purple-600">
                {stock.volume > 1000000 ? '高' : stock.volume > 500000 ? '中' : '低'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};