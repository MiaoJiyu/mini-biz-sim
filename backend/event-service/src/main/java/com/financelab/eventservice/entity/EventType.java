package com.financelab.eventservice.entity;

public enum EventType {
    POSITIVE,      // 正面事件
    NEGATIVE,      // 负面事件
    NEUTRAL,       // 中性事件
    MARKET_CRASH,  // 市场崩盘
    ECONOMIC_BOOM, // 经济繁荣
    NATURAL_DISASTER, // 自然灾害
    POLITICAL_EVENT, // 政治事件
    TECHNOLOGY_BREAKTHROUGH, // 技术突破
    FINANCIAL_REGULATION, // 金融监管
    COMPANY_NEWS,  // 公司新闻
    GLOBAL_EVENT   // 全球事件
}
