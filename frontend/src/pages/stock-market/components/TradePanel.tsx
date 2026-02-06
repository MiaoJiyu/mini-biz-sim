import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StockQuote, TradeRequest, StockService, UserPosition } from '@/services/stockService';
import { ShoppingCart, TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';

interface TradePanelProps {
  stock: StockQuote | null;
  onTrade: (tradeRequest: TradeRequest) => Promise<boolean>;
}

export const TradePanel: React.FC<TradePanelProps> = ({ stock, onTrade }) => {
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [quantity, setQuantity] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [isTrading, setIsTrading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [userPositions, setUserPositions] = useState<UserPosition[]>([]);

  // 模拟当前用户ID（实际项目中应该从认证系统获取）
  const currentUserId = 'user-123';

  // 加载用户持仓
  useEffect(() => {
    const loadUserPositions = async () => {
      const positions = await StockService.getUserPositions(currentUserId);
      setUserPositions(positions);
    };
    loadUserPositions();
  }, []);

  // 获取当前股票的持仓
  const currentPosition = userPositions.find(p => p.stock.code === stock?.code);

  // 重置表单
  const resetForm = () => {
    setQuantity('');
    setPrice('');
    setMessage(null);
  };

  // 处理交易
  const handleTrade = async () => {
    if (!stock || !quantity || parseFloat(quantity) <= 0) {
      setMessage({ type: 'error', text: '请输入有效的交易数量' });
      return;
    }

    if (orderType === 'LIMIT' && (!price || parseFloat(price) <= 0)) {
      setMessage({ type: 'error', text: '限价单必须指定价格' });
      return;
    }

    // 检查持仓是否足够（卖出时）
    if (tradeType === 'SELL' && currentPosition) {
      const availableQuantity = currentPosition.quantity;
      if (parseFloat(quantity) > availableQuantity) {
        setMessage({ type: 'error', text: `持仓不足，当前持有 ${availableQuantity} 股` });
        return;
      }
    }

    setIsTrading(true);
    setMessage(null);

    const tradeRequest: TradeRequest = {
      userId: currentUserId,
      stockCode: stock.code,
      tradeType,
      quantity: parseInt(quantity),
      price: orderType === 'MARKET' ? stock.currentPrice : parseFloat(price),
      orderType
    };

    const success = await onTrade(tradeRequest);
    
    if (success) {
      setMessage({ 
        type: 'success', 
        text: `${tradeType === 'BUY' ? '买入' : '卖出'} ${stock.name} ${quantity} 股成功！` 
      });
      resetForm();
      
      // 刷新持仓数据
      const positions = await StockService.getUserPositions(currentUserId);
      setUserPositions(positions);
    } else {
      setMessage({ type: 'error', text: '交易失败，请稍后重试' });
    }

    setIsTrading(false);
  };

  // 计算交易总金额
  const totalAmount = stock ? 
    (parseFloat(quantity) || 0) * (orderType === 'MARKET' ? stock.currentPrice : parseFloat(price) || 0) : 0;

  if (!stock) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">请选择一只股票</h3>
            <p className="text-gray-600">在左侧股票列表中选择一只股票进行交易</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* 股票信息卡片 */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{stock.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-blue-600">{stock.code}</span>
                <span className="text-sm text-gray-500">{stock.company}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {stock.currentPrice.toFixed(2)}
              </div>
              <div className={`flex items-center justify-end gap-1 ${
                stock.change > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stock.change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="font-medium">
                  {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)} 
                  ({stock.change > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 交易表单 */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-blue-500" />
              交易面板
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 交易类型选择 */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={tradeType === 'BUY' ? 'default' : 'outline'}
                onClick={() => setTradeType('BUY')}
                className={`h-12 text-lg font-medium ${
                  tradeType === 'BUY' 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'border-green-200 text-green-600 hover:bg-green-50'
                }`}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                买入
              </Button>
              <Button
                variant={tradeType === 'SELL' ? 'default' : 'outline'}
                onClick={() => setTradeType('SELL')}
                className={`h-12 text-lg font-medium ${
                  tradeType === 'SELL' 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'border-red-200 text-red-600 hover:bg-red-50'
                }`}
              >
                <TrendingDown className="w-4 h-4 mr-2" />
                卖出
              </Button>
            </div>

            {/* 订单类型 */}
            <div className="space-y-2">
              <Label htmlFor="orderType">订单类型</Label>
              <Select value={orderType} onValueChange={(value: 'MARKET' | 'LIMIT') => setOrderType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MARKET">市价单（按当前价格成交）</SelectItem>
                  <SelectItem value="LIMIT">限价单（指定价格成交）</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 价格输入（限价单） */}
            {orderType === 'LIMIT' && (
              <div className="space-y-2">
                <Label htmlFor="price">价格（元）</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="请输入价格"
                />
              </div>
            )}

            {/* 数量输入 */}
            <div className="space-y-2">
              <Label htmlFor="quantity">数量（股）</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="请输入交易数量"
              />
            </div>

            {/* 交易总金额 */}
            {totalAmount > 0 && (
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">交易总金额:</span>
                    <span className="text-lg font-bold text-blue-600">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      {totalAmount.toFixed(2)} 元
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 交易按钮 */}
            <Button
              onClick={handleTrade}
              disabled={isTrading || !quantity || parseFloat(quantity) <= 0}
              className={`w-full h-12 text-lg font-medium ${
                tradeType === 'BUY' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              } text-white`}
            >
              {isTrading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  交易中...
                </div>
              ) : (
                `${tradeType === 'BUY' ? '买入' : '卖出'} ${stock.name}`
              )}
            </Button>

            {/* 消息提示 */}
            {message && (
              <div className={`p-3 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {message.text}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 持仓信息 */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              持仓信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentPosition ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600">持仓数量</div>
                    <div className="text-xl font-bold text-blue-600">{currentPosition.quantity}</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-gray-600">平均成本</div>
                    <div className="text-xl font-bold text-green-600">{currentPosition.averagePrice.toFixed(2)}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-sm text-gray-600">当前市值</div>
                    <div className="text-xl font-bold text-purple-600">{currentPosition.currentValue.toFixed(2)}</div>
                  </div>
                  <div className={`text-center p-3 rounded-lg ${
                    currentPosition.profitLoss >= 0 ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                    <div className="text-sm text-gray-600">浮动盈亏</div>
                    <div className={`text-xl font-bold ${
                      currentPosition.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {currentPosition.profitLoss >= 0 ? '+' : ''}{currentPosition.profitLoss.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <div className="text-sm text-gray-600">收益率</div>
                  <div className={`text-lg font-bold ${
                    currentPosition.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {((currentPosition.profitLoss / (currentPosition.averagePrice * currentPosition.quantity)) * 100).toFixed(2)}%
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">暂无持仓</p>
                <p className="text-sm text-gray-400 mt-1">买入股票后显示持仓信息</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 交易提醒 */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <div>
              <h4 className="font-medium text-amber-800">交易风险提示</h4>
              <p className="text-sm text-amber-700">
                股票投资有风险，请根据自身风险承受能力进行交易。本系统为模拟环境，不构成投资建议。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};