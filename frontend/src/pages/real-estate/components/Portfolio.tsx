import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Property, realEstateService } from '../../../services/realEstateService';
import { authService } from '../../../services/authService';

interface PortfolioProps {
  properties: Property[];
  onPropertyUpdate: () => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ properties, onPropertyUpdate }) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [sellPrice, setSellPrice] = useState('');
  const [listPrice, setListPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<'sell' | 'list' | 'upgrade' | 'repair'>('sell');

  const currentUser = authService.getCurrentUser();

  // 计算资产统计
  const portfolioStats = {
    totalValue: properties.reduce((sum, p) => sum + p.currentPrice, 0),
    totalCost: properties.reduce((sum, p) => sum + (p.purchasePrice || 0), 0),
    monthlyIncome: properties.filter(p => p.isRented).reduce((sum, p) => sum + p.rentalIncome, 0),
    monthlyExpenses: properties.reduce((sum, p) => sum + p.maintenanceCost + p.propertyTax, 0),
    totalProperties: properties.length,
    rentedProperties: properties.filter(p => p.isRented).length
  };

  const totalGain = portfolioStats.totalValue - portfolioStats.totalCost;
  const gainPercentage = portfolioStats.totalCost > 0 ? (totalGain / portfolioStats.totalCost) * 100 : 0;
  const netMonthlyIncome = portfolioStats.monthlyIncome - portfolioStats.monthlyExpenses;

  const handleSell = async () => {
    if (!selectedProperty || !currentUser) return;
    
    try {
      setLoading(true);
      const price = parseFloat(sellPrice);
      if (isNaN(price) || price <= 0) {
        alert('请输入有效的出售价格');
        return;
      }

      await realEstateService.sellProperty(selectedProperty.id, currentUser.id, price);
      alert('出售成功！');
      setSelectedProperty(null);
      setSellPrice('');
      onPropertyUpdate();
    } catch (error: any) {
      alert(`出售失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleListForSale = async () => {
    if (!selectedProperty || !currentUser) return;
    
    try {
      setLoading(true);
      const price = parseFloat(listPrice);
      if (isNaN(price) || price <= 0) {
        alert('请输入有效的挂牌价格');
        return;
      }

      await realEstateService.listPropertyForSale(selectedProperty.id, currentUser.id, price);
      alert('挂牌成功！');
      setSelectedProperty(null);
      setListPrice('');
      onPropertyUpdate();
    } catch (error: any) {
      alert(`挂牌失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (!selectedProperty || !currentUser) return;
    
    try {
      setLoading(true);
      await realEstateService.upgradeProperty(selectedProperty.id, currentUser.id);
      alert('升级成功！');
      setSelectedProperty(null);
      onPropertyUpdate();
    } catch (error: any) {
      alert(`升级失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRepair = async () => {
    if (!selectedProperty || !currentUser) return;
    
    try {
      setLoading(true);
      await realEstateService.repairProperty(selectedProperty.id, currentUser.id);
      alert('修复成功！');
      setSelectedProperty(null);
      onPropertyUpdate();
    } catch (error: any) {
      alert(`修复失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getPropertyTypeColor = (type: string) => {
    switch (type) {
      case 'RESIDENTIAL': return 'bg-blue-100 text-blue-800';
      case 'COMMERCIAL': return 'bg-green-100 text-green-800';
      case 'INDUSTRIAL': return 'bg-orange-100 text-orange-800';
      case 'LAND': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPropertyTypeLabel = (type: string) => {
    switch (type) {
      case 'RESIDENTIAL': return '住宅';
      case 'COMMERCIAL': return '商业';
      case 'INDUSTRIAL': return '工业';
      case 'LAND': return '土地';
      default: return type;
    }
  };

  if (properties.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <i className="fas fa-home text-4xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-semibold text-gray-600">暂无房产资产</h3>
          <p className="text-gray-500 mt-2">您还没有购买任何房产，快去房产市场看看吧！</p>
          <Button className="mt-4" onClick={() => window.location.href = '/real-estate?tab=market'}>
            前往房产市场
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 资产概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 text-sm">资产总值</p>
                <p className="text-2xl font-bold mt-1">
                  ¥{portfolioStats.totalValue.toLocaleString()}
                </p>
              </div>
              <i className="fas fa-chart-line text-xl"></i>
            </div>
            <div className="mt-3 text-blue-100 text-sm">
              {gainPercentage > 0 ? '+' : ''}{gainPercentage.toFixed(2)}% 收益
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-100 text-sm">月净收入</p>
                <p className="text-2xl font-bold mt-1">
                  ¥{netMonthlyIncome.toLocaleString()}
                </p>
              </div>
              <i className="fas fa-money-bill-wave text-xl"></i>
            </div>
            <div className="mt-3 text-green-100 text-sm">
              {portfolioStats.rentedProperties}/{portfolioStats.totalProperties} 处出租
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-purple-100 text-sm">房产数量</p>
                <p className="text-2xl font-bold mt-1">{portfolioStats.totalProperties}</p>
              </div>
              <i className="fas fa-building text-xl"></i>
            </div>
            <div className="mt-3 text-purple-100 text-sm">
              分布在 {new Set(properties.map(p => p.city.name)).size} 个城市
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-orange-100 text-sm">平均收益率</p>
                <p className="text-2xl font-bold mt-1">
                  {properties.length > 0 
                    ? (properties.reduce((sum, p) => sum + (p.rentalYield || 0), 0) / properties.length).toFixed(2)
                    : '0.00'
                  }%
                </p>
              </div>
              <i className="fas fa-percentage text-xl"></i>
            </div>
            <div className="mt-3 text-orange-100 text-sm">
              基于租金收入计算
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 房产列表 */}
      <Card>
        <CardHeader>
          <CardTitle>我的房产列表</CardTitle>
          <CardDescription>
            管理您的房产资产，包括出售、出租、升级等操作
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {properties.map(property => (
              <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-home text-blue-600"></i>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold">{property.name}</h4>
                      <Badge className={getPropertyTypeColor(property.type)}>
                        {getPropertyTypeLabel(property.type)}
                      </Badge>
                      {property.isRented && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          已出租
                        </Badge>
                      )}
                      {property.isForSale && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          挂牌中
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {property.city.name} · {property.location}
                    </p>
                    <div className="flex items-center space-x-4 mt-1 text-sm">
                      <span>面积: {property.totalArea}㎡</span>
                      <span>价值: ¥{property.currentPrice.toLocaleString()}</span>
                      <span className={`${property.priceChangeRate && property.priceChangeRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {property.priceChangeRate && property.priceChangeRate > 0 ? '+' : ''}
                        {property.priceChangeRate?.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedProperty(property);
                          setActiveAction('sell');
                        }}
                      >
                        出售
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedProperty(property);
                          setActiveAction('list');
                        }}
                      >
                        挂牌
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedProperty(property);
                          setActiveAction('upgrade');
                        }}
                        disabled={property.upgradeLevel >= property.maxUpgradeLevel}
                      >
                        升级
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedProperty(property);
                          setActiveAction('repair');
                        }}
                        disabled={!property.conditionRating || property.conditionRating >= 10}
                      >
                        修复
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 操作对话框 */}
      <Dialog open={!!selectedProperty} onOpenChange={() => setSelectedProperty(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {activeAction === 'sell' && '出售房产'}
              {activeAction === 'list' && '挂牌出售'}
              {activeAction === 'upgrade' && '升级房产'}
              {activeAction === 'repair' && '修复房产'}
            </DialogTitle>
            <DialogDescription>
              {selectedProperty?.name} - {selectedProperty?.city.name}
            </DialogDescription>
          </DialogHeader>
          
          {activeAction === 'sell' && (
            <div className="space-y-4">
              <p>请输入出售价格：</p>
              <Input
                type="number"
                placeholder="出售价格"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
              />
              <div className="text-sm text-gray-500">
                <p>当前市值: ¥{selectedProperty?.currentPrice.toLocaleString()}</p>
                <p>交易将产生1%手续费和5%税费</p>
              </div>
              <Button onClick={handleSell} disabled={loading} className="w-full">
                {loading ? '处理中...' : '确认出售'}
              </Button>
            </div>
          )}

          {activeAction === 'list' && (
            <div className="space-y-4">
              <p>请输入挂牌价格：</p>
              <Input
                type="number"
                placeholder="挂牌价格"
                value={listPrice}
                onChange={(e) => setListPrice(e.target.value)}
              />
              <div className="text-sm text-gray-500">
                <p>当前市值: ¥{selectedProperty?.currentPrice.toLocaleString()}</p>
                <p>挂牌后其他玩家可以购买此房产</p>
              </div>
              <Button onClick={handleListForSale} disabled={loading} className="w-full">
                {loading ? '处理中...' : '确认挂牌'}
              </Button>
            </div>
          )}

          {activeAction === 'upgrade' && (
            <div className="space-y-4">
              <p>升级房产将提升其价值和租金收入</p>
              <div className="text-sm text-gray-500">
                <p>当前等级: {selectedProperty?.upgradeLevel}/{selectedProperty?.maxUpgradeLevel}</p>
                <p>升级后价格将提升10%</p>
              </div>
              <Button onClick={handleUpgrade} disabled={loading} className="w-full">
                {loading ? '处理中...' : '确认升级'}
              </Button>
            </div>
          )}

          {activeAction === 'repair' && (
            <div className="space-y-4">
              <p>修复房产将改善房屋状况</p>
              <div className="text-sm text-gray-500">
                <p>当前状况: {selectedProperty?.conditionRating}/10</p>
                <p>修复后房屋状况将提升1级</p>
              </div>
              <Button onClick={handleRepair} disabled={loading} className="w-full">
                {loading ? '处理中...' : '确认修复'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Portfolio;