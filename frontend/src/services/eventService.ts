import axios from 'axios';

const API_BASE_URL = 'http://localhost:8085/api';

export const eventService = {
  // 获取用户所有事件
  getUserEvents: async (userId: number) => {
    const response = await axios.get(`${API_BASE_URL}/user-events/user/${userId}`);
    return response.data;
  },

  // 获取待处理事件
  getPendingEvents: async (userId: number) => {
    const response = await axios.get(`${API_BASE_URL}/user-events/user/${userId}/pending`);
    return response.data;
  },

  // 获取待处理事件数量
  getPendingEventCount: async (userId: number) => {
    const response = await axios.get(`${API_BASE_URL}/user-events/user/${userId}/count`);
    return response.data;
  },

  // 解析事件
  resolveEvent: async (userEventId: number, choice: string) => {
    const response = await axios.post(
      `${API_BASE_URL}/user-events/${userEventId}/resolve`,
      { choice }
    );
    return response.data;
  },

  // 获取事件选项
  getEventChoices: async (eventId: number) => {
    const response = await axios.get(`${API_BASE_URL}/events/${eventId}/choices`);
    return response.data;
  },

  // 触发指定事件
  triggerEvent: async (eventId: number, userId: number) => {
    const response = await axios.post(
      `${API_BASE_URL}/events/${eventId}/trigger?userId=${userId}`
    );
    return response.data;
  },

  // 触发随机事件
  triggerRandomEvent: async (userId: number) => {
    const response = await axios.post(`${API_BASE_URL}/events/random/${userId}`);
    return response.data;
  },

  // 获取所有活动事件
  getAllActiveEvents: async () => {
    const response = await axios.get(`${API_BASE_URL}/events`);
    return response.data;
  },

  // 按分类获取事件
  getEventsByCategory: async (category: string) => {
    const response = await axios.get(`${API_BASE_URL}/events/category/${category}`);
    return response.data;
  },

  // 按类型获取事件
  getEventsByType: async (type: string) => {
    const response = await axios.get(`${API_BASE_URL}/events/type/${type}`);
    return response.data;
  },

  // 检查是否有待处理事件
  hasPendingEvent: async (userId: number) => {
    const response = await axios.get(`${API_BASE_URL}/user-events/user/${userId}/has-pending`);
    return response.data;
  },
};
