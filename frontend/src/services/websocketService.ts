import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

// WebSocket服务类
export class WebSocketService {
  private client: Client | null = null;
  private isConnected = false;
  private subscriptions: Map<string, any> = new Map();

  // 连接WebSocket
  connect(onConnect?: () => void, onError?: (error: any) => void): void {
    if (this.isConnected) return;

    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8081/ws-stock'),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        this.isConnected = true;
        console.log('WebSocket连接成功');
        onConnect?.();
      },
      onStompError: (frame) => {
        console.error('WebSocket错误:', frame);
        onError?.(frame);
      },
      onDisconnect: () => {
        this.isConnected = false;
        console.log('WebSocket连接断开');
      }
    });

    this.client.activate();
  }

  // 断开连接
  disconnect(): void {
    if (this.client && this.isConnected) {
      this.subscriptions.forEach((subscription, key) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();
      this.client.deactivate();
      this.isConnected = false;
      console.log('WebSocket已断开连接');
    }
  }

  // 订阅股票价格实时更新
  subscribeToStockPrices(callback: (stocks: any[]) => void): string {
    const subscription = this.client?.subscribe('/topic/stock-prices', (message) => {
      try {
        const stocks = JSON.parse(message.body);
        callback(stocks);
      } catch (error) {
        console.error('解析股票价格消息失败:', error);
      }
    });

    const subscriptionId = 'stock-prices';
    if (subscription) {
      this.subscriptions.set(subscriptionId, subscription);
    }

    return subscriptionId;
  }

  // 订阅涨跌幅排行榜
  subscribeToTopStocks(callback: (stocks: any[]) => void): string {
    const subscription = this.client?.subscribe('/topic/top-stocks', (message) => {
      try {
        const stocks = JSON.parse(message.body);
        callback(stocks);
      } catch (error) {
        console.error('解析排行榜消息失败:', error);
      }
    });

    const subscriptionId = 'top-stocks';
    if (subscription) {
      this.subscriptions.set(subscriptionId, subscription);
    }

    return subscriptionId;
  }

  // 订阅单个股票价格
  subscribeToStockPrice(stockCode: string, callback: (stock: any) => void): string {
    const subscription = this.client?.subscribe(`/topic/stock-price/${stockCode}`, (message) => {
      try {
        const stock = JSON.parse(message.body);
        callback(stock);
      } catch (error) {
        console.error(`解析股票 ${stockCode} 价格消息失败:`, error);
      }
    });

    const subscriptionId = `stock-price-${stockCode}`;
    if (subscription) {
      this.subscriptions.set(subscriptionId, subscription);
    }

    return subscriptionId;
  }

  // 订阅交易确认消息
  subscribeToTradeConfirmations(userId: string, callback: (confirmation: any) => void): string {
    const subscription = this.client?.subscribe(`/user/${userId}/queue/trade-confirmations`, (message) => {
      try {
        const confirmation = JSON.parse(message.body);
        callback(confirmation);
      } catch (error) {
        console.error('解析交易确认消息失败:', error);
      }
    });

    const subscriptionId = `trade-confirmations-${userId}`;
    if (subscription) {
      this.subscriptions.set(subscriptionId, subscription);
    }

    return subscriptionId;
  }

  // 取消订阅
  unsubscribe(subscriptionId: string): void {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(subscriptionId);
    }
  }

  // 检查连接状态
  getIsConnected(): boolean {
    return this.isConnected;
  }
}

// 创建全局实例
export const websocketService = new WebSocketService();