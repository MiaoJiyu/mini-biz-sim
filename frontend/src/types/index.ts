// 用户相关类型

export interface User {
  id: string
  username: string
  email: string
  role: UserRole
  level: number
  totalAssets: number
  cashBalance: number
  creditScore: number
  createdAt: string
  lastLogin?: string
  classId?: string
}

export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

// 股票相关类型

export interface Stock {
  id: string
  code: string
  name: string
  industry: string
  currentPrice: number
  previousClose: number
  change: number
  changePercent: number
  riskLevel: number
  marketCap: number
  isActive: boolean
}

export interface StockPosition {
  id: string
  userId: string
  stockId: string
  stockCode: string
  stockName: string
  quantity: number
  avgCost: number
  currentValue: number
  profitLoss: number
  profitLossPercent: number
}

export interface TradeRequest {
  stockCode: string
  type: TradeType
  quantity: number
  price?: number
  orderType: OrderType
}

export enum TradeType {
  BUY = 'BUY',
  SELL = 'SELL'
}

export enum OrderType {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT'
}

// 房地产相关类型

export interface RealEstate {
  id: string
  city: string
  district: string
  basePricePerSqm: number
  rentYield: number
  appreciationPotential: number
  riskCoefficient: number
  isAvailable: boolean
}

export interface PropertyHolding {
  id: string
  userId: string
  realEstateId: string
  city: string
  district: string
  area: number
  purchasePrice: number
  currentValue: number
  isRented: boolean
  monthlyRent: number
  purchaseDate: string
}

// 银行相关类型

export interface Loan {
  id: string
  userId: string
  type: LoanType
  principal: number
  interestRate: number
  remainingAmount: number
  termWeeks: number
  startDate: string
  dueDate: string
  status: LoanStatus
  leverageMultiplier?: number
  marginRatio?: number
}

export enum LoanType {
  NORMAL = 'NORMAL',
  LEVERAGE = 'LEVERAGE'
}

export enum LoanStatus {
  ACTIVE = 'ACTIVE',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  DEFAULTED = 'DEFAULTED'
}

// 商场相关类型

export interface MallItem {
  id: string
  name: string
  category: ItemCategory
  price: number
  currency: CurrencyType
  effectDescription: string
  durationHours: number
  isLimited: boolean
  stockQuantity: number
  vipLevelRequired: number
  isAvailable: boolean
}

export enum ItemCategory {
  BOOST = 'BOOST',
  FUNCTIONAL = 'FUNCTIONAL',
  DECORATIVE = 'DECORATIVE',
  STRATEGIC = 'STRATEGIC'
}

export enum CurrencyType {
  GOLD = 'GOLD',
  DIAMOND = 'DIAMOND',
  POINT = 'POINT'
}

export interface ConsumptionRecord {
  id: string
  userId: string
  itemId: string
  itemName: string
  quantity: number
  totalPrice: number
  currency: CurrencyType
  purchaseTime: string
  isImpulse: boolean
}

// 随机事件相关类型

export interface RandomEvent {
  id: string
  name: string
  type: EventType
  description: string
  impactRange: ImpactRange
  impactFactor: number
  durationDays: number
  triggerProbability: number
  isActive: boolean
}

export enum EventType {
  MACRO = 'MACRO',
  INDUSTRY = 'INDUSTRY',
  COMPANY = 'COMPANY',
  PERSONAL = 'PERSONAL'
}

export enum ImpactRange {
  GLOBAL = 'GLOBAL',
  INDUSTRY = 'INDUSTRY',
  SPECIFIC = 'SPECIFIC'
}

export interface EventTrigger {
  id: string
  eventId: string
  eventName: string
  userId?: string
  triggerTime: string
  endTime: string
  isActive: boolean
}

// API响应类型

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 仪表盘数据类型

export interface DashboardData {
  user: User
  stockPositions: StockPosition[]
  propertyHoldings: PropertyHolding[]
  activeLoans: Loan[]
  totalAssets: number
  dailyChange: number
  dailyChangePercent: number
  marketTrend: MarketTrendItem[]
  recentActivities: ActivityItem[]
}

export interface MarketTrendItem {
  time: string
  value: number
}

export interface ActivityItem {
  id: string
  type: ActivityType
  description: string
  amount?: number
  timestamp: string
}

export enum ActivityType {
  STOCK_TRADE = 'STOCK_TRADE',
  PROPERTY_PURCHASE = 'PROPERTY_PURCHASE',
  LOAN_APPLICATION = 'LOAN_APPLICATION',
  ITEM_PURCHASE = 'ITEM_PURCHASE',
  LEVEL_UP = 'LEVEL_UP'
}

// WebSocket消息类型

export interface WebSocketMessage {
  type: WebSocketMessageType
  data: any
  timestamp: string
}

export enum WebSocketMessageType {
  STOCK_PRICE_UPDATE = 'STOCK_PRICE_UPDATE',
  TRADE_EXECUTED = 'TRADE_EXECUTED',
  EVENT_TRIGGERED = 'EVENT_TRIGGERED',
  SYSTEM_NOTIFICATION = 'SYSTEM_NOTIFICATION'
}