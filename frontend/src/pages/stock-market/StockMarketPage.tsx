import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StockService, StockQuote, TradeRequest } from '@/services/stockService';
import { websocketService } from '@/services/websocketService';
import { StockList } from './components/StockList';
import { StockChart } from './components/StockChart';
import { TradePanel } from './components/TradePanel';
import { Portfolio } from './components/Portfolio';
import { TrendingUp, TrendingDown, Search, RefreshCw } from 'lucide-react';

export const StockMarketPage: React.FC = () => {
  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockQuote | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('market');

  // 加载股票数据
  const loadStocks = async () => {
    setIsLoading(true);
    try {
      const activeStocks = await StockService.getActiveStocks();
      setStocks(activeStocks);
      if (activeStocks.length > 0 && !selectedStock) {
        setSelectedStock(activeStocks[0]);
      }
    } catch (error) {
      console.error('加载股票数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 搜索股票
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadStocks();
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await StockService.searchStocks(searchTerm);
      setStocks(searchResults);
    } catch (error) {
      console.error('搜索股票失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 执行交易
  const handleTrade = async (tradeRequest: TradeRequest) => {
    try {
      const result = await StockService.executeTrade(tradeRequest);
      if (result.status === 'SUCCESS') {
        // 刷新数据
        loadStocks();
        return true;
      } else {
        console.error('交易失败:', result.message);
        return false;
      }
    } catch (error) {
      console.error('交易执行失败:', error);
      return false;
    }
  };

  // WebSocket连接和实时数据订阅
  useEffect(() => {
    // 初始加载数据
    loadStocks();

    // 连接WebSocket
    websocketService.connect(
      () => {
        console.log('WebSocket连接成功，开始接收实时数据');
        
        // 订阅股票价格实时更新
        websocketService.subscribeToStockPrices((updatedStocks) => {
          setStocks(prevStocks => {
            const updatedMap = new Map(updatedStocks.map((s: StockQuote) => [s.code, s]));
            return prevStocks.map(stock => updatedMap.get(stock.code) || stock);
          });
        });

        // 订阅涨跌幅排行榜
        websocketService.subscribeToTopStocks((topStocks) => {
          // 可以用于特殊显示
          console.log('排行榜更新:', topStocks);
        });
      },
      (error) => {
        console.error('WebSocket连接失败:', error);
      }
    );

    // 清理函数
    return () => {
      websocketService.disconnect();
    };
  }, []);

  // 处理键盘搜索
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            股票市场模拟系统
          </h1>
          <p className="text-lg text-gray-600">
            实时模拟股票交易，体验真实市场波动
          </p>
        </div>

        {/* 搜索栏 */}
        <div className="mb-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="搜索股票代码、名称或公司..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10 pr-4 py-2 border-0 bg-gray-50/50 focus:bg-white transition-all duration-300"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-300"
                >
                  搜索
                </Button>
                <Button 
                  onClick={loadStocks}
                  variant="outline"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 transition-all duration-300"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  刷新
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主内容区 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg p-1">
            <TabsTrigger 
              value="market" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-300"
            >
              市场行情
            </TabsTrigger>
            <TabsTrigger 
              value="chart" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-300"
            >
              价格图表
            </TabsTrigger>
            <TabsTrigger 
              value="trade" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-300"
            >
              交易面板
            </TabsTrigger>
            <TabsTrigger 
              value="portfolio" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-300"
            >
              我的持仓
            </TabsTrigger>
          </TabsList>

          {/* 市场行情标签页 */}
          <TabsContent value="market" className="space-y-6">
            <StockList 
              stocks={stocks} 
              selectedStock={selectedStock}
              onSelectStock={setSelectedStock}
              isLoading={isLoading}
            />
          </TabsContent>

          {/* 价格图表标签页 */}
          <TabsContent value="chart">
            <StockChart 
              stock={selectedStock}
              isLoading={isLoading}
            />
          </TabsContent>

          {/* 交易面板标签页 */}
          <TabsContent value="trade">
            <TradePanel 
              stock={selectedStock}
              onTrade={handleTrade}
            />
          </TabsContent>

          {/* 我的持仓标签页 */}
          <TabsContent value="portfolio">
            <Portfolio />
          </TabsContent>
        </Tabs>

        {/* 实时状态指示器 */}
        <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg border">
          <div className={`w-2 h-2 rounded-full ${websocketService.getIsConnected() ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600">
            {websocketService.getIsConnected() ? '实时连接' : '连接断开'}
          </span>
        </div>
      </div>
    </div>
  );
};