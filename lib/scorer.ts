import type { MemeToken } from './types';

export function estimateSafetyScore(token: MemeToken): number {
  let score = 50;

  const liq = token.liquidity ?? 0;
  if (liq > 1_000_000) score += 20;
  else if (liq > 100_000) score += 10;
  else if (liq < 10_000) score -= 15;

  const vol = token.volume24h ?? 0;
  const mcap = token.marketCap ?? 1;
  if (mcap > 0 && vol / mcap > 0.5) score += 10;

  const priceChange = Math.abs(token.priceChange24h ?? 0);
  if (priceChange > 10000) score -= 20;
  else if (priceChange > 1000) score -= 10;
  else if (priceChange < 200) score += 10;

  return Math.max(0, Math.min(100, score));
}
