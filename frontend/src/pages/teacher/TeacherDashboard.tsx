import React from 'react';
import { authService } from '../../services/authService';

const TeacherDashboard: React.FC = () => {
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
              <p className="text-sm text-gray-600">教师管理面板</p>
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
            <div className="text-2xl font-bold text-blue-600">45</div>
            <div className="text-sm text-gray-600">班级学生</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-green-600">3</div>
            <div className="text-sm text-gray-600">活跃班级</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-purple-600">85%</div>
            <div className="text-sm text-gray-600">平均完成率</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-red-600">12</div>
            <div className="text-sm text-gray-600">待批改作业</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 班级管理 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">班级管理</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-blue-50 rounded-md hover:bg-blue-100">
                <span className="font-medium text-blue-700">学生列表</span>
              </button>
              <button className="w-full text-left p-3 bg-green-50 rounded-md hover:bg-green-100">
                <span className="font-medium text-green-700">分组管理</span>
              </button>
              <button className="w-full text-left p-3 bg-purple-50 rounded-md hover:bg-purple-100">
                <span className="font-medium text-purple-700">成绩分析</span>
              </button>
            </div>
          </div>

          {/* 教学工具 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">教学工具</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-yellow-50 rounded-md hover:bg-yellow-100">
                <span className="font-medium text-yellow-700">发布任务</span>
              </button>
              <button className="w-full text-left p-3 bg-red-50 rounded-md hover:bg-red-100">
                <span className="font-medium text-red-700">游戏配置</span>
              </button>
              <button className="w-full text-left p-3 bg-indigo-50 rounded-md hover:bg-indigo-100">
                <span className="font-medium text-indigo-700">教学报告</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">最新动态</h2>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-700">学生张三完成"股票投资入门"任务</p>
              <p className="text-xs text-gray-500">10分钟前</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-700">班级A的平均资产达到15,000金币</p>
              <p className="text-xs text-gray-500">1小时前</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-700">学生李四的信用评分提升至120分</p>
              <p className="text-xs text-gray-500">2小时前</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;