import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Save, RefreshCw, Play, Pause } from 'lucide-react';

export default function GameConfiguration() {
  const [stockConfig, setStockConfig] = useState({
    initialFunds: 10000,
    marketVolatility: 0.15,
    eventFrequency: 30,
    maxLeverage: 2
  });

  const [realEstateConfig, setRealEstateConfig] = useState({
    basePropertyPrice: 100000,
    rentMultiplier: 0.005,
    appreciationRate: 0.05,
    transactionTax: 0.02
  });

  const [bankConfig, setBankConfig] = useState({
    baseInterestRate: 0.05,
    creditScoreThreshold: 60,
    loanToValueRatio: 0.8,
    penaltyRate: 0.1
  });

  const handleSaveConfig = () => {
    console.log('保存配置:', { stockConfig, realEstateConfig, bankConfig });
    // 调用API保存配置
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">游戏配置</h1>
          <p className="text-sm text-gray-600">调整游戏参数和事件设置</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            重置默认
          </Button>
          <Button onClick={handleSaveConfig}>
            <Save className="w-4 h-4 mr-2" />
            保存配置
          </Button>
        </div>
      </div>

      <Tabs defaultValue="stock" className="space-y-4">
        <TabsList>
          <TabsTrigger value="stock">股票市场</TabsTrigger>
          <TabsTrigger value="realestate">房地产市场</TabsTrigger>
          <TabsTrigger value="bank">银行系统</TabsTrigger>
          <TabsTrigger value="events">事件系统</TabsTrigger>
          <TabsTrigger value="economy">经济参数</TabsTrigger>
        </TabsList>

        {/* 股票市场配置 */}
        <TabsContent value="stock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>股票市场参数</CardTitle>
              <CardDescription>调整股票交易和市场波动参数</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>初始资金 (¥)</Label>
                <Input
                  type="number"
                  value={stockConfig.initialFunds}
                  onChange={(e) => setStockConfig({...stockConfig, initialFunds: Number(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <Label>市场波动率: {(stockConfig.marketVolatility * 100).toFixed(0)}%</Label>
                <Slider
                  value={[stockConfig.marketVolatility]}
                  onValueChange={([value]) => setStockConfig({...stockConfig, marketVolatility: value})}
                  min={0.05}
                  max={0.3}
                  step={0.01}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>事件触发频率 (分钟)</Label>
                <Slider
                  value={[stockConfig.eventFrequency]}
                  onValueChange={([value]) => setStockConfig({...stockConfig, eventFrequency: value})}
                  min={5}
                  max={60}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>最大杠杆倍数</Label>
                <Input
                  type="number"
                  value={stockConfig.maxLeverage}
                  onChange={(e) => setStockConfig({...stockConfig, maxLeverage: Number(e.target.value)})}
                  min={1}
                  max={10}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 房地产配置 */}
        <TabsContent value="realestate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>房地产市场参数</CardTitle>
              <CardDescription>调整房产价格、租金和增值率</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>基准房产价格 (¥)</Label>
                <Input
                  type="number"
                  value={realEstateConfig.basePropertyPrice}
                  onChange={(e) => setRealEstateConfig({...realEstateConfig, basePropertyPrice: Number(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <Label>租金收益率: {(realEstateConfig.rentMultiplier * 100).toFixed(1)}%</Label>
                <Slider
                  value={[realEstateConfig.rentMultiplier]}
                  onValueChange={([value]) => setRealEstateConfig({...realEstateConfig, rentMultiplier: value})}
                  min={0.002}
                  max={0.01}
                  step={0.001}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>年增值率: {(realEstateConfig.appreciationRate * 100).toFixed(1)}%</Label>
                <Slider
                  value={[realEstateConfig.appreciationRate]}
                  onValueChange={([value]) => setRealEstateConfig({...realEstateConfig, appreciationRate: value})}
                  min={0.01}
                  max={0.15}
                  step={0.01}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>交易税率: {(realEstateConfig.transactionTax * 100).toFixed(1)}%</Label>
                <Slider
                  value={[realEstateConfig.transactionTax]}
                  onValueChange={([value]) => setRealEstateConfig({...realEstateConfig, transactionTax: value})}
                  min={0.005}
                  max={0.05}
                  step={0.005}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 银行配置 */}
        <TabsContent value="bank" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>银行系统参数</CardTitle>
              <CardDescription>调整利率、信用评分标准和贷款比例</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>基准利率: {(bankConfig.baseInterestRate * 100).toFixed(1)}%</Label>
                <Slider
                  value={[bankConfig.baseInterestRate]}
                  onValueChange={([value]) => setBankConfig({...bankConfig, baseInterestRate: value})}
                  min={0.02}
                  max={0.15}
                  step={0.005}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>信用评分门槛</Label>
                <Input
                  type="number"
                  value={bankConfig.creditScoreThreshold}
                  onChange={(e) => setBankConfig({...bankConfig, creditScoreThreshold: Number(e.target.value)})}
                  min={0}
                  max={200}
                />
              </div>

              <div className="space-y-2">
                <Label>贷款价值比: {(bankConfig.loanToValueRatio * 100).toFixed(0)}%</Label>
                <Slider
                  value={[bankConfig.loanToValueRatio]}
                  onValueChange={([value]) => setBankConfig({...bankConfig, loanToValueRatio: value})}
                  min={0.5}
                  max={0.95}
                  step={0.05}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>逾期罚息率: {(bankConfig.penaltyRate * 100).toFixed(1)}%</Label>
                <Slider
                  value={[bankConfig.penaltyRate]}
                  onValueChange={([value]) => setBankConfig({...bankConfig, penaltyRate: value})}
                  min={0.05}
                  max={0.3}
                  step={0.01}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 事件系统配置 */}
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>事件系统控制</CardTitle>
              <CardDescription>启用或禁用特定事件类型</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: '市场崩盘', enabled: true, probability: 5 },
                { name: '经济繁荣', enabled: true, probability: 10 },
                { name: '自然灾害', enabled: true, probability: 3 },
                { name: '公司裁员', enabled: true, probability: 8 },
                { name: '升职加薪', enabled: true, probability: 12 },
                { name: '突发疾病', enabled: true, probability: 5 },
              ].map((event, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{event.name}</h4>
                    <p className="text-sm text-gray-600">触发概率: {event.probability}%</p>
                  </div>
                  <Button variant="outline" size="sm">
                    {event.enabled ? '已启用' : '已禁用'}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 经济参数配置 */}
        <TabsContent value="economy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>宏观经济参数</CardTitle>
              <CardDescription>设置整体经济环境参数</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">经济状态</h4>
                  <p className="text-sm text-gray-600">当前经济繁荣程度</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">衰退</Button>
                  <Button variant="default" size="sm">平稳</Button>
                  <Button variant="outline" size="sm">繁荣</Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">游戏控制</h4>
                  <p className="text-sm text-gray-600">控制游戏进程</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Pause className="w-4 h-4 mr-2" />
                    暂停游戏
                  </Button>
                  <Button variant="default" size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    继续游戏
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
