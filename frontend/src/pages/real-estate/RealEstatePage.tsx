import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { City, Property, realEstateService } from '../../services/realEstateService';
import { authService } from '../../services/authService';
import CityMap from './components/CityMap';
import PropertyList from './components/PropertyList';
import Portfolio from './components/Portfolio';
import TransactionHistory from './components/TransactionHistory';

const RealEstatePage: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [userProperties, setUserProperties] = useState<Property[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('market');
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);

  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [citiesData, propertiesData] = await Promise.all([
        realEstateService.getAllCities(),
        realEstateService.getPropertiesForSale()
      ]);
      
      setCities(citiesData);
      setProperties(propertiesData);
      
      if (currentUser) {
        const userProps = await realEstateService.getUserProperties(currentUser.id);
        setUserProperties(userProps);
      }
    } catch (error) {
      console.error('加载房地产数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.city.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = propertyType === 'all' || property.type === propertyType;
    const matchesPrice = property.currentPrice >= priceRange[0] && property.currentPrice <= priceRange[1];
    
    return matchesSearch && matchesType && matchesPrice;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载房地产数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 页面头部 */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">房地产投资</h1>
              <p className="text-gray-600 mt-2">探索城市地产，把握投资机会</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-sm">
                在售房产: {properties.length}
              </Badge>
              <Badge variant="secondary" className="text-sm">
                我的房产: {userProperties.length}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="market">
              <span className="flex items-center space-x-2">
                <i className="fas fa-building text-blue-600"></i>
                <span>房产市场</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="map">
              <span className="flex items-center space-x-2">
                <i className="fas fa-map text-green-600"></i>
                <span>城市地图</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="portfolio">
              <span className="flex items-center space-x-2">
                <i className="fas fa-chart-line text-purple-600"></i>
                <span>我的资产</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="history">
              <span className="flex items-center space-x-2">
                <i className="fas fa-history text-orange-600"></i>
                <span>交易历史</span>
              </span>
            </TabsTrigger>
          </TabsList>

          {/* 搜索和筛选 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="搜索房产名称或城市..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger>
                  <SelectValue placeholder="房产类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有类型</SelectItem>
                  <SelectItem value="RESIDENTIAL">住宅</SelectItem>
                  <SelectItem value="COMMERCIAL">商业</SelectItem>
                  <SelectItem value="INDUSTRIAL">工业</SelectItem>
                  <SelectItem value="LAND">土地</SelectItem>
                </SelectContent>
              </Select>
              <Select 
                value={`${priceRange[0]}-${priceRange[1]}`} 
                onValueChange={(value) => {
                  const [min, max] = value.split('-').map(Number);
                  setPriceRange([min, max]);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="价格范围" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-100000000">所有价格</SelectItem>
                  <SelectItem value="0-1000000">100万以下</SelectItem>
                  <SelectItem value="1000000-5000000">100-500万</SelectItem>
                  <SelectItem value="5000000-20000000">500-2000万</SelectItem>
                  <SelectItem value="20000000-100000000">2000万以上</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 房产市场 */}
          <TabsContent value="market" className="space-y-6">
            <PropertyList 
              properties={filteredProperties}
              onPropertyUpdate={loadData}
            />
          </TabsContent>

          {/* 城市地图 */}
          <TabsContent value="map" className="space-y-6">
            <CityMap 
              cities={cities}
              properties={properties}
              selectedCity={selectedCity}
              onCitySelect={setSelectedCity}
            />
          </TabsContent>

          {/* 我的资产 */}
          <TabsContent value="portfolio" className="space-y-6">
            <Portfolio 
              properties={userProperties}
              onPropertyUpdate={loadData}
            />
          </TabsContent>

          {/* 交易历史 */}
          <TabsContent value="history" className="space-y-6">
            <TransactionHistory userId={currentUser?.id || ''} />
          </TabsContent>
        </Tabs>

        {/* 快速操作面板 */}
        <Card className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-white">快速投资指南</CardTitle>
            <CardDescription className="text-blue-100">
              新手投资建议与策略
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/10 rounded-lg">
                <i className="fas fa-chart-line text-2xl mb-2"></i>
                <h4 className="font-semibold">关注增长潜力</h4>
                <p className="text-sm text-blue-100">选择经济发达、基础设施完善的城市</p>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-lg">
                <i className="fas fa-balance-scale text-2xl mb-2"></i>
                <h4 className="font-semibold">分散投资风险</h4>
                <p className="text-sm text-blue-100">在不同城市和类型间分散投资</p>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-lg">
                <i className="fas fa-home text-2xl mb-2"></i>
                <h4 className="font-semibold">长期持有策略</h4>
                <p className="text-sm text-blue-100">房地产投资适合长期持有增值</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealEstatePage;