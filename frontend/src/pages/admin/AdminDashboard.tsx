import React from 'react';
import { authService } from '../../services/authService';

const AdminDashboard: React.FC = () => {
  const handleLogout = () => {
    authService.logout();
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
              <p className="text-sm text-gray-600">管理员控制台</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* 统计卡片 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-blue-600">1,234</div>
            <div className="text-sm text-gray-600">总用户数</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-green-600">1,200</div>
            <div className="text-sm text-gray-600">学生用户</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-purple-600">30</div>
            <div className="text-sm text-gray-600">教师用户</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-red-600">4</div>
            <div className="text-sm text-gray-600">管理员</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 系统管理 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">系统管理</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-blue-50 rounded-md hover:bg-blue-100">
                <span className="font-medium text-blue-700">用户管理</span>
              </button>
              <button className="w-full text-left p-3 bg-green-50 rounded-md hover:bg-green-100">
                <span className="font-medium text-green-700">权限配置</span>
              </button>
              <button className="w-full text-left p-3 bg-purple-50 rounded-md hover:bg-purple-100">
                <span className="font-medium text-purple-700">系统设置</span>
              </button>
            </div>
          </div>

          {/* 数据统计 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">数据统计</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-yellow-50 rounded-md hover:bg-yellow-100">
                <span className="font-medium text-yellow-700">交易数据分析</span>
              </button>
              <button className="w-full text-left p-3 bg-red-50 rounded-md hover:bg-red-100">
                <span className="font-medium text-red-700">用户行为分析</span>
              </button>
              <button className="w-full text-left p-3 bg-indigo-50 rounded-md hover:bg-indigo-100">
                <span className="font-medium text-indigo-700">系统监控</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;