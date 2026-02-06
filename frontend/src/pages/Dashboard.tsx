import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    authService.logout();
  };

  const navigateToStockMarket = () => {
    navigate('/stock-market');
  };

  const navigateToRealEstate = () => {
    navigate('/real-estate');
  };

  const navigateToBank = () => {
    navigate('/bank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                财商学堂 | FinanceLab
              </h1>
              <p className="text-sm text-gray-600">学生仪表盘</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 资产概览卡片 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">资产概览</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">总资产</span>
                <span className="font-medium">10,000 金币</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">现金余额</span>
                <span className="font-medium">10,000 金币</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">今日收益</span>
                <span className="text-green-600 font-medium">+0 金币</span>
              </div>
            </div>
          </div>

          {/* 账户信息卡片 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">账户信息</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">等级</span>
                <span className="font-medium">Lv.1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">信用评分</span>
                <span className="font-medium">100 分</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">风险等级</span>
                <span className="text-yellow-600 font-medium">低风险</span>
              </div>
            </div>
          </div>

          {/* 快速操作卡片 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h2>
            <div className="space-y-3">
              <button 
                onClick={navigateToStockMarket}
                className="w-full text-left p-3 bg-blue-50 rounded-md hover:bg-blue-100 transition-all duration-300"
              >
                <span className="font-medium text-blue-700">进入股票市场</span>
              </button>
              <button 
                onClick={navigateToRealEstate}
                className="w-full text-left p-3 bg-green-50 rounded-md hover:bg-green-100 transition-all duration-300"
              >
                <span className="font-medium text-green-700">房地产投资</span>
              </button>
              <button 
                onClick={navigateToBank}
                className="w-full text-left p-3 bg-purple-50 rounded-md hover:bg-purple-100 transition-all duration-300"
              >
                <span className="font-medium text-purple-700">银行服务</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 市场动态 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">市场动态</h2>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">今日股票市场表现平稳</p>
                <p className="text-xs text-gray-500">2小时前</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">房地产价格略有上涨</p>
                <p className="text-xs text-gray-500">4小时前</p>
              </div>
            </div>
          </div>

          {/* 今日任务 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">今日任务</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-md">
                <span className="text-sm">完成新手引导</span>
                <button className="px-3 py-1 bg-yellow-500 text-white text-xs rounded">
                  开始
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
                <span className="text-sm">购买第一支股票</span>
                <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded">
                  前往
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;