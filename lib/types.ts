export type Signal = 'STRONG_BUY' | 'BUY' | 'WATCH' | 'AVOID';

export type MemeToken = {
  address: string;
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  volumeChange24h: number;
  marketCap: number;
  liquidity: number;
  rank: number;
  isNew: boolean;
  safetyScore: number | null;
  aiAnalysis: string | null;
  signal: Signal | null;
  confidence: number | null;
  holders: number | null;
  buys24h: number | null;
  sells24h: number | null;
};

export type AISignal = {
  signal: Signal;
  analysis: string;
  confidence: number;
};

export type TelegramAlert = {
  address: string;
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  volumeChange24h: number;
  signal: string;
  analysis: string;
  confidence: number;
  safetyScore: number | null;
};

export type ScanMeta = {
  birdeyeCalls: number;
  apiCalls: number;
  alertsSent: number;
  timestamp: string;
  aiEnabled: boolean;
  alertsEnabled: boolean;
};
