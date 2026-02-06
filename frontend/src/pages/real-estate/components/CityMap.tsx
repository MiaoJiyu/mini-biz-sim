import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { City, Property } from '../../../services/realEstateService';

interface CityMapProps {
  cities: City[];
  properties: Property[];
  selectedCity: City | null;
  onCitySelect: (city: City) => void;
}

const CityMap: React.FC<CityMapProps> = ({ cities, properties, selectedCity, onCitySelect }) => {
  // 计算每个城市的统计数据
  const getCityStats = (city: City) => {
    const cityProperties = properties.filter(p => p.city.id === city.id);
    const avgPrice = cityProperties.length > 0 
      ? cityProperties.reduce((sum, p) => sum + p.currentPrice, 0) / cityProperties.length
      : 0;
    const avgYield = cityProperties.length > 0
      ? cityProperties.reduce((sum, p) => sum + (p.rentalYield || 0), 0) / cityProperties.length
      : 0;
    
    return {
      propertyCount: cityProperties.length,
      averagePrice: avgPrice,
      averageYield: avgYield
    };
  };

  // 模拟中国主要城市的地理位置（简化版）
  const cityPositions: Record<string, { x: number; y: number }> = {
    '北京': { x: 65, y: 25 },
    '上海': { x: 75, y: 45 },
    '深圳': { x: 60, y: 70 },
    '广州': { x: 55, y: 65 },
    '杭州': { x: 70, y: 50 },
    '成都': { x: 35, y: 45 },
    '重庆': { x: 40, y: 50 },
    '武汉': { x: 55, y: 45 },
    '西安': { x: 45, y: 30 },
    '沈阳': { x: 65, y: 20 }
  };

  return (
    <div className="space-y-6">
      {/* 地图容器 */}
      <Card className="relative">
        <CardHeader>
          <CardTitle>中国主要城市地产分布图</CardTitle>
          <CardDescription>
            点击城市查看详细信息和可用房产
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-96 bg-gradient-to-br from-green-50 to-blue-50 border rounded-lg overflow-hidden">
            {/* 简化的中国地图轮廓 */}
            <div className="absolute inset-4 border-2 border-gray-300 rounded-lg"></div>
            
            {/* 城市标记点 */}
            {cities.map(city => {
              const position = cityPositions[city.name];
              if (!position) return null;
              
              const stats = getCityStats(city);
              const isSelected = selectedCity?.id === city.id;
              
              return (
                <div
                  key={city.id}
                  className={`absolute cursor-pointer transition-all duration-300 ${
                    isSelected ? 'z-10 scale-110' : 'hover:scale-105'
                  }`}
                  style={{ left: `${position.x}%`, top: `${position.y}%` }}
                  onClick={() => onCitySelect(city)}
                >
                  <div className={`relative ${
                    isSelected 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-white text-gray-700 shadow-md hover:shadow-lg'
                  } rounded-full p-3 w-12 h-12 flex items-center justify-center font-semibold`}>
                    <span className="text-xs">{city.name.substring(0, 2)}</span>
                    
                    {/* 城市标记点上的小圆点 */}
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                      stats.propertyCount > 0 ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 选中的城市详细信息 */}
      {selectedCity && (
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{selectedCity.name}</CardTitle>
                <CardDescription>{selectedCity.region}地区</CardDescription>
              </div>
              <Badge variant={selectedCity.growthRate > 0.06 ? "default" : "secondary"}>
                年增长率: {(selectedCity.growthRate * 100).toFixed(1)}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  ¥{selectedCity.basePricePerSqm.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">基础均价/㎡</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {getCityStats(selectedCity).propertyCount}
                </div>
                <div className="text-sm text-gray-600">可用房产</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {selectedCity.populationDensity}人/km²
                </div>
                <div className="text-sm text-gray-600">人口密度</div>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {selectedCity.infrastructureScore}/10
                </div>
                <div className="text-sm text-gray-600">基础设施评分</div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">经济状况</h4>
                <div className="flex items-center space-x-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${selectedCity.economicDevelopmentLevel * 10}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{selectedCity.economicDevelopmentLevel}/10</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">价格波动性</h4>
                <div className="flex items-center space-x-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${selectedCity.priceVolatility * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{(selectedCity.priceVolatility * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-3">投资建议</h4>
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  {selectedCity.growthRate > 0.07 ? 
                    "该城市增长潜力巨大，适合长期投资。" :
                    "该城市增长稳定，适合稳健型投资。"
                  }
                  {selectedCity.priceVolatility > 0.1 ? 
                    " 注意价格波动较大，建议分散投资。" :
                    " 价格波动较小，风险相对可控。"
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 城市列表快速导航 */}
      <Card>
        <CardHeader>
          <CardTitle>城市快速导航</CardTitle>
          <CardDescription>点击快速切换到其他城市</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {cities.map(city => (
              <Button
                key={city.id}
                variant={selectedCity?.id === city.id ? "default" : "outline"}
                size="sm"
                onClick={() => onCitySelect(city)}
                className="justify-start"
              >
                <span className="truncate">{city.name}</span>
                <Badge variant="secondary" className="ml-2">
                  {getCityStats(city).propertyCount}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CityMap;