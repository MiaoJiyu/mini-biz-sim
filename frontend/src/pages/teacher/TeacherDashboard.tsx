import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Button } from '@/components/ui/button';
import StudentManagement from './StudentManagement';
import GameConfiguration from './GameConfiguration';
import TaskManagement from './TaskManagement';
import Analytics from './Analytics';
import { Users, Settings, Target, BarChart3, Home, Bell, LogOut } from 'lucide-react';

type View = 'overview' | 'students' | 'tasks' | 'config' | 'analytics';

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<View>('overview');

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const renderView = () => {
    switch (currentView) {
      case 'students':
        return <StudentManagement />;
      case 'tasks':
        return <TaskManagement />;
      case 'config':
        return <GameConfiguration />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Overview />;
    }
  };

  const Overview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl font-bold text-blue-600">45</div>
          <div className="text-sm text-gray-600 mt-1">班级学生</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl font-bold text-green-600">3</div>
          <div className="text-sm text-gray-600 mt-1">活跃班级</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl font-bold text-purple-600">85%</div>
          <div className="text-sm text-gray-600 mt-1">平均完成率</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl font-bold text-orange-600">12</div>
          <div className="text-sm text-gray-600 mt-1">待批改作业</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setCurrentView('students')}
              className="p-4 bg-blue-50 rounded-md hover:bg-blue-100 transition-all"
            >
              <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <span className="font-medium text-blue-700">学生管理</span>
            </button>
            <button
              onClick={() => setCurrentView('tasks')}
              className="p-4 bg-green-50 rounded-md hover:bg-green-100 transition-all"
            >
              <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <span className="font-medium text-green-700">任务管理</span>
            </button>
            <button
              onClick={() => setCurrentView('config')}
              className="p-4 bg-purple-50 rounded-md hover:bg-purple-100 transition-all"
            >
              <Settings className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <span className="font-medium text-purple-700">游戏配置</span>
            </button>
            <button
              onClick={() => setCurrentView('analytics')}
              className="p-4 bg-yellow-50 rounded-md hover:bg-yellow-100 transition-all"
            >
              <BarChart3 className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <span className="font-medium text-yellow-700">数据分析</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
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
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 侧边栏 */}
      <aside className="w-64 bg-white shadow-lg fixed h-full">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">财商学堂</h1>
          <p className="text-sm text-gray-600">教师管理面板</p>
        </div>

        <nav className="p-4 space-y-2">
          <button
            onClick={() => setCurrentView('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'overview'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Home className="w-5 h-5" />
            概览
          </button>

          <button
            onClick={() => setCurrentView('students')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'students'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            学生管理
          </button>

          <button
            onClick={() => setCurrentView('tasks')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'tasks'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Target className="w-5 h-5" />
            任务管理
          </button>

          <button
            onClick={() => setCurrentView('config')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'config'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Settings className="w-5 h-5" />
            游戏配置
          </button>

          <button
            onClick={() => setCurrentView('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'analytics'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            数据分析
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <Button
            onClick={() => navigate('/events')}
            variant="outline"
            className="w-full mb-2"
          >
            <Bell className="w-4 h-4 mr-2" />
            事件中心
          </Button>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            退出登录
          </Button>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 ml-64 p-8">
        {renderView()}
      </main>
    </div>
  );
};

export default TeacherDashboard;