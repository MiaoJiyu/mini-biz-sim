import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Property, realEstateService } from '../../../services/realEstateService';
import { authService } from '../../../services/authService';

interface PropertyListProps {
  properties: Property[];
  onPropertyUpdate: () => void;
}

const PropertyList: React.FC<PropertyListProps> = ({ properties, onPropertyUpdate }) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [purchasePrice, setPurchasePrice] = useState('');
  const [loading, setLoading] = useState(false);

  const currentUser = authService.getCurrentUser();

  const handlePurchase = async () => {
    if (!selectedProperty || !currentUser) return;
    
    try {
      setLoading(true);
      const price = parseFloat(purchasePrice);
      if (isNaN(price) || price <= 0) {
        alert('请输入有效的购买价格');
        return;
      }

      await realEstateService.purchaseProperty(selectedProperty.id, currentUser.id, price);
      alert('购买成功！');
      setSelectedProperty(null);
      setPurchasePrice('');
      onPropertyUpdate();
    } catch (error: any) {
      alert(`购买失败: ${error.message}`);
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
          <h3 className="text-lg font-semibold text-gray-600">暂无可用房产</h3>
          <p className="text-gray-500 mt-2">当前筛选条件下没有找到匹配的房产</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">房产列表</h2>
          <p className="text-gray-600">共找到 {properties.length} 处可用房产</p>
        </div>
        <div className="flex space-x-2">
          <Badge variant="secondary">住宅: {properties.filter(p => p.type === 'RESIDENTIAL').length}</Badge>
          <Badge variant="secondary">商业: {properties.filter(p => p.type === 'COMMERCIAL').length}</Badge>
          <Badge variant="secondary">工业: {properties.filter(p => p.type === 'INDUSTRIAL').length}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(property => (
          <Card key={property.id} className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{property.name}</CardTitle>
                  <CardDescription>{property.location}</CardDescription>
                </div>
                <Badge className={getPropertyTypeColor(property.type)}>
                  {getPropertyTypeLabel(property.type)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">所在城市</span>
                  <Badge variant="outline">{property.city.name}</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">面积</span>
                  <span className="font-medium">{property.totalArea} ㎡</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">当前价格</span>
                  <span className="text-lg font-bold text-blue-600">
                    ¥{property.currentPrice.toLocaleString()}
                  </span>
                </div>
                
                {property.priceChangeRate && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">涨跌幅</span>
                    <span className={`font-medium ${
                      property.priceChangeRate > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {property.priceChangeRate > 0 ? '+' : ''}{property.priceChangeRate.toFixed(2)}%
                    </span>
                  </div>
                )}
                
                {property.rentalYield && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">租金收益率</span>
                    <span className="font-medium text-green-600">
                      {property.rentalYield.toFixed(2)}%
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">月租金</span>
                  <span className="font-medium">¥{property.rentalIncome.toLocaleString()}</span>
                </div>
                
                {property.conditionRating && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">房屋状况</span>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i}
                          className={`fas fa-star text-sm ${
                            i < Math.floor(property.conditionRating / 2) 
                              ? 'text-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        ></i>
                      ))}
                      <span className="text-xs text-gray-500">{property.conditionRating}/10</span>
                    </div>
                  </div>
                )}
                
                <div className="pt-3 border-t">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full"
                        onClick={() => setSelectedProperty(property)}
                      >
                        查看详情
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{property.name}</DialogTitle>
                        <DialogDescription>
                          {property.city.name} · {property.location}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>房产类型:</span>
                            <Badge className={getPropertyTypeColor(property.type)}>
                              {getPropertyTypeLabel(property.type)}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>总面积:</span>
                            <span>{property.totalArea} ㎡</span>
                          </div>
                          <div className="flex justify-between">
                            <span>可用面积:</span>
                            <span>{property.usableArea} ㎡</span>
                          </div>
                          {property.constructionYear && (
                            <div className="flex justify-between">
                              <span>建造年份:</span>
                              <span>{property.constructionYear}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>当前价格:</span>
                            <span className="font-bold text-blue-600">
                              ¥{property.currentPrice.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>月租金:</span>
                            <span>¥{property.rentalIncome.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>维护费用:</span>
                            <span>¥{property.maintenanceCost.toLocaleString()}/月</span>
                          </div>
                          <div className="flex justify-between">
                            <span>房产税:</span>
                            <span>¥{property.propertyTax.toLocaleString()}/月</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="font-semibold mb-2">投资分析</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="bg-blue-50 p-3 rounded">
                            <div>年租金收入</div>
                            <div className="font-bold">
                              ¥{(property.rentalIncome * 12).toLocaleString()}
                            </div>
                          </div>
                          <div className="bg-green-50 p-3 rounded">
                            <div>净月收入</div>
                            <div className="font-bold text-green-600">
                              ¥{((property.rentalIncome || 0) - (property.maintenanceCost || 0) - (property.propertyTax || 0)).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {currentUser && (
                        <div className="mt-6">
                          <h4 className="font-semibold mb-3">购买操作</h4>
                          <div className="flex space-x-3">
                            <Input
                              type="number"
                              placeholder="输入购买价格"
                              value={purchasePrice}
                              onChange={(e) => setPurchasePrice(e.target.value)}
                              className="flex-1"
                            />
                            <Button 
                              onClick={handlePurchase}
                              disabled={loading}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {loading ? '处理中...' : '立即购买'}
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            提示：交易将产生1%手续费和5%税费
                          </p>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PropertyList;