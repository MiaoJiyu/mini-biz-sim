import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/stocks';

// 股票行情数据接口
export interface StockQuote {
  code: string;
  name: string;
  company: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  marketCap: number;
  industry: string;
  isActive: boolean;
}

// 交易请求接口
export interface TradeRequest {
  userId: string;
  stockCode: string;
  tradeType: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  orderType: 'MARKET' | 'LIMIT';
}

// 交易结果接口
export interface TradeResult {
  tradeId?: number;
  stockCode: string;
  stockName: string;
  tradeType: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  totalAmount: number;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  tradeTime: string;
  message: string;
}

// 用户持仓接口
export interface UserPosition {
  id: number;
  userId: string;
  stock: {
    id: number;
    code: string;
    name: string;
    currentPrice: number;
  };
  quantity: number;
  averagePrice: number;
  currentValue: number;
  profitLoss: number;
  createdAt: string;
  lastUpdated: string;
}

// 交易记录接口
export interface TradeRecord {
  id: number;
  userId: string;
  stock: {
    id: number;
    code: string;
    name: string;
  };
  tradeType: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  totalAmount: number;
  orderType: 'MARKET' | 'LIMIT';
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  tradeTime: string;
}

// 股票服务类
export class StockService {
  
  // 获取所有活跃股票
  static async getActiveStocks(): Promise<StockQuote[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/active`);
      return response.data;
    } catch (error) {
      console.error('获取活跃股票失败:', error);
      return [];
    }
  }

  // 获取股票行情
  static async getStockQuote(stockCode: string): Promise<StockQuote | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/${stockCode}`);
      return response.data;
    } catch (error) {
      console.error(`获取股票 ${stockCode} 行情失败:`, error);
      return null;
    }
  }

  // 搜索股票
  static async searchStocks(keyword: string): Promise<StockQuote[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/search?keyword=${encodeURIComponent(keyword)}`);
      return response.data;
    } catch (error) {
      console.error('搜索股票失败:', error);
      return [];
    }
  }

  // 获取涨跌幅排行榜
  static async getTopGainersAndLosers(): Promise<StockQuote[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/top`);
      return response.data;
    } catch (error) {
      console.error('获取排行榜失败:', error);
      return [];
    }
  }

  // 执行交易
  static async executeTrade(tradeRequest: TradeRequest): Promise<TradeResult> {
    try {
      const response = await axios.post(`${API_BASE_URL}/trade`, tradeRequest);
      return response.data;
    } catch (error: any) {
      console.error('交易执行失败:', error);
      return {
        stockCode: tradeRequest.stockCode,
        stockName: '',
        tradeType: tradeRequest.tradeType,
        quantity: tradeRequest.quantity,
        price: tradeRequest.price,
        totalAmount: tradeRequest.quantity * tradeRequest.price,
        status: 'FAILED',
        tradeTime: new Date().toISOString(),
        message: error.response?.data?.message || '交易失败'
      };
    }
  }

  // 获取用户持仓
  static async getUserPositions(userId: string): Promise<UserPosition[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/positions/${userId}`);
      return response.data;
    } catch (error) {
      console.error('获取用户持仓失败:', error);
      return [];
    }
  }

  // 获取交易记录
  static async getTradeHistory(userId: string, days: number = 30): Promise<TradeRecord[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/history/${userId}?days=${days}`);
      return response.data;
    } catch (error) {
      console.error('获取交易记录失败:', error);
      return [];
    }
  }

  // 获取用户总资产
  static async getUserTotalAssets(userId: string): Promise<number> {
    try {
      const response = await axios.get(`${API_BASE_URL}/assets/${userId}`);
      return response.data;
    } catch (error) {
      console.error('获取用户资产失败:', error);
      return 0;
    }
  }
}