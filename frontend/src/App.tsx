import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/authService';
import { User, UserRole } from './types';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import { StockMarketPage } from './pages/stock-market/StockMarketPage';
import RealEstatePage from './pages/real-estate/RealEstatePage';
import BankPage from './pages/bank/BankPage';
import MallPage from './pages/mall/MallPage';
import EventsPage from './pages/Events';
import LoadingSpinner from './components/ui/LoadingSpinner';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('认证检查失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 路由保护组件
  const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: UserRole }> = ({ 
    children, 
    requiredRole 
  }) => {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      );
    }

    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }

    if (requiredRole && currentUser.role !== requiredRole) {
      return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
  };

  // 公共路由组件（已登录用户不能访问）
  const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      );
    }

    if (currentUser) {
      // 根据用户角色重定向到不同页面
      switch (currentUser.role) {
        case UserRole.ADMIN:
          return <Navigate to="/admin/dashboard" replace />;
        case UserRole.TEACHER:
          return <Navigate to="/teacher/dashboard" replace />;
        default:
          return <Navigate to="/dashboard" replace />;
      }
    }

    return <>{children}</>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* 公共路由 */}
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          
          <Route path="/register" element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } />
          
          {/* 受保护的路由 */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/stock-market" element={
            <ProtectedRoute>
              <StockMarketPage />
            </ProtectedRoute>
          } />
          
          <Route path="/real-estate" element={
            <ProtectedRoute>
              <RealEstatePage />
            </ProtectedRoute>
          } />
          
          <Route path="/bank" element={
            <ProtectedRoute>
              <BankPage />
            </ProtectedRoute>
          } />

          <Route path="/mall" element={
            <ProtectedRoute>
              <MallPage />
            </ProtectedRoute>
          } />

          <Route path="/events" element={
            <ProtectedRoute>
              <EventsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRole={UserRole.ADMIN}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/teacher/dashboard" element={
            <ProtectedRoute requiredRole={UserRole.TEACHER}>
              <TeacherDashboard />
            </ProtectedRoute>
          } />
          
          {/* 默认路由 */}
          <Route path="/" element={
            currentUser ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } />
          
          {/* 404页面 */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-lg text-gray-600 mb-4">页面未找到</p>
                <button 
                  onClick={() => window.history.back()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  返回上一页
                </button>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;