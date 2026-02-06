import { User, UserRole } from '../types';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  nickname?: string;
  role?: UserRole;
  schoolId?: number;
  classId?: number;
}

export interface AuthResponse {
  message: string;
  token?: string;
  userId?: number;
  username?: string;
}

class AuthService {
  private baseUrl = 'http://localhost:8081/user-service/api/users';
  private tokenKey = 'financeLabToken';

  // 登录
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (response.ok) {
        // 保存token到localStorage
        localStorage.setItem(this.tokenKey, data.token);
        return data;
      } else {
        throw new Error(data.error || '登录失败');
      }
    } catch (error) {
      throw new Error(`登录失败: ${error instanceof Error ? error.message : '网络错误'}`);
    }
  }

  // 注册
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.error || '注册失败');
      }
    } catch (error) {
      throw new Error(`注册失败: ${error instanceof Error ? error.message : '网络错误'}`);
    }
  }

  // 获取当前用户信息
  async getCurrentUser(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await fetch(`${this.baseUrl}/validate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      
      if (response.ok && data.valid) {
        return data.user;
      } else {
        this.logout();
        return null;
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      this.logout();
      return null;
    }
  }

  // 验证token
  async validateToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch(`${this.baseUrl}/validate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      return data.valid || false;
    } catch (error) {
      console.error('Token验证失败:', error);
      return false;
    }
  }

  // 获取token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // 检查是否已登录
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // 登出
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    // 重定向到登录页
    window.location.href = '/login';
  }

  // 获取认证头
  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
}

export const authService = new AuthService();