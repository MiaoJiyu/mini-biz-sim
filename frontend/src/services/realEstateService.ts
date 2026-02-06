import api from './api';

export interface City {
  id: number;
  name: string;
  region: string;
  basePricePerSqm: number;
  priceVolatility: number;
  growthRate: number;
  populationDensity: number;
  economicDevelopmentLevel: number;
  infrastructureScore: number;
  averagePropertyPrice?: number;
  totalProperties?: number;
  averageRentalYield?: number;
}

export interface Property {
  id: number;
  name: string;
  city: City;
  type: string;
  location: string;
  totalArea: number;
  usableArea: number;
  purchasePrice: number;
  currentPrice: number;
  rentalIncome: number;
  maintenanceCost: number;
  propertyTax: number;
  constructionYear?: number;
  conditionRating?: number;
  upgradeLevel: number;
  maxUpgradeLevel: number;
  isForSale: boolean;
  isRented: boolean;
  ownerId?: string;
  priceChange?: number;
  priceChangeRate?: number;
  rentalYield?: number;
  netMonthlyIncome?: number;
  annualReturnRate?: number;
  lastPriceUpdate?: string;
}

export interface PropertyTransaction {
  id: number;
  property: Property;
  buyerId: string;
  sellerId?: string;
  type: string;
  transactionPrice: number;
  transactionFee: number;
  taxAmount: number;
  rentalDuration?: number;
  rentalStartDate?: string;
  rentalEndDate?: string;
  transactionDate: string;
  status: string;
  totalAmount?: number;
  buyerName?: string;
  sellerName?: string;
}

class RealEstateService {
  // 城市相关API
  async getAllCities(): Promise<City[]> {
    const response = await api.get('/api/real-estate/cities');
    return response.data;
  }

  async getCityById(cityId: number): Promise<City> {
    const response = await api.get(`/api/real-estate/cities/${cityId}`);
    return response.data;
  }

  async getCitiesByRegion(region: string): Promise<City[]> {
    const response = await api.get(`/api/real-estate/cities/region/${region}`);
    return response.data;
  }

  // 房产相关API
  async getAllProperties(): Promise<Property[]> {
    const response = await api.get('/api/real-estate/properties');
    return response.data;
  }

  async getPropertiesByCity(cityId: number): Promise<Property[]> {
    const response = await api.get(`/api/real-estate/properties/city/${cityId}`);
    return response.data;
  }

  async getPropertiesForSale(): Promise<Property[]> {
    const response = await api.get('/api/real-estate/properties/for-sale');
    return response.data;
  }

  async getPropertyById(propertyId: number): Promise<Property> {
    const response = await api.get(`/api/real-estate/properties/${propertyId}`);
    return response.data;
  }

  async getUserProperties(userId: string): Promise<Property[]> {
    const response = await api.get(`/api/real-estate/properties/user/${userId}`);
    return response.data;
  }

  // 房产交易API
  async purchaseProperty(propertyId: number, userId: string, purchasePrice: number): Promise<PropertyTransaction> {
    const response = await api.post(`/api/real-estate/properties/${propertyId}/purchase?userId=${userId}&purchasePrice=${purchasePrice}`);
    return response.data;
  }

  async sellProperty(propertyId: number, userId: string, sellPrice: number): Promise<PropertyTransaction> {
    const response = await api.post(`/api/real-estate/properties/${propertyId}/sell?userId=${userId}&sellPrice=${sellPrice}`);
    return response.data;
  }

  async rentProperty(propertyId: number, userId: string, durationMonths: number): Promise<PropertyTransaction> {
    const response = await api.post(`/api/real-estate/properties/${propertyId}/rent?userId=${userId}&durationMonths=${durationMonths}`);
    return response.data;
  }

  async cancelRental(propertyId: number, userId: string): Promise<PropertyTransaction> {
    const response = await api.post(`/api/real-estate/properties/${propertyId}/cancel-rental?userId=${userId}`);
    return response.data;
  }

  // 房产管理API
  async upgradeProperty(propertyId: number, userId: string): Promise<Property> {
    const response = await api.post(`/api/real-estate/properties/${propertyId}/upgrade?userId=${userId}`);
    return response.data;
  }

  async repairProperty(propertyId: number, userId: string): Promise<Property> {
    const response = await api.post(`/api/real-estate/properties/${propertyId}/repair?userId=${userId}`);
    return response.data;
  }

  async listPropertyForSale(propertyId: number, userId: string, price: number): Promise<Property> {
    const response = await api.post(`/api/real-estate/properties/${propertyId}/list-for-sale?userId=${userId}&price=${price}`);
    return response.data;
  }

  async removePropertyFromSale(propertyId: number, userId: string): Promise<Property> {
    const response = await api.post(`/api/real-estate/properties/${propertyId}/remove-from-sale?userId=${userId}`);
    return response.data;
  }

  // 交易历史API
  async getUserTransactionHistory(userId: string): Promise<PropertyTransaction[]> {
    const response = await api.get(`/api/real-estate/transactions/user/${userId}`);
    return response.data;
  }

  async getPropertyTransactionHistory(propertyId: number): Promise<PropertyTransaction[]> {
    const response = await api.get(`/api/real-estate/transactions/property/${propertyId}`);
    return response.data;
  }

  // 统计分析API
  async calculateUserNetWorth(userId: string): Promise<number> {
    const response = await api.get(`/api/real-estate/user/${userId}/net-worth`);
    return response.data;
  }

  async calculateUserMonthlyIncome(userId: string): Promise<number> {
    const response = await api.get(`/api/real-estate/user/${userId}/monthly-income`);
    return response.data;
  }

  async calculateUserMonthlyExpenses(userId: string): Promise<number> {
    const response = await api.get(`/api/real-estate/user/${userId}/monthly-expenses`);
    return response.data;
  }
}

export const realEstateService = new RealEstateService();