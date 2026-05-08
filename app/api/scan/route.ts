import { NextResponse } from 'next/server';
import { fetchTrendingTokens, fetchNewListings } from '@/lib/birdeye';
import { analyzeToken } from '@/lib/groq';
import { sendAlert } from '@/lib/telegram';
import { estimateSafetyScore } from '@/lib/scorer';
import type { MemeToken, TelegramAlert } from '@/lib/types';

export const dynamic = 'force-dynamic';

const alertedTokens = new Set<string>();

function extractArray(res: any): any[] {
  if (Array.isArray(res?.data?.items)) return res.data.items;
  if (Array.isArray(res?.data?.tokens)) return res.data.tokens;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.items)) return res.items;
  if (Array.isArray(res?.tokens)) return res.tokens;
  return [];
}

function mapToToken(raw: any, isNew: boolean): MemeToken {
  return {
    address: raw?.address ?? '',
    symbol: raw?.symbol ?? 'UNKNOWN',
    name: raw?.name ?? 'Unknown Token',
    price: raw?.price ?? 0,
    priceChange24h: raw?.price24hChangePercent ?? 0,
    volume24h: raw?.volume24hUSD ?? 0,
    volumeChange24h: raw?.volume24hChangePercent ?? 0,
    marketCap: raw?.marketcap ?? raw?.marketCap ?? 0,
    liquidity: raw?.liquidity ?? 0,
    rank: raw?.rank ?? 0,
    isNew,
    safetyScore: null,
    aiAnalysis: null,
    signal: null,
  };
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const withAi = url.searchParams.get('ai') === 'true';
    const withAlerts = url.searchParams.get('alerts') === 'true';

    // 1. Fetch Birdeye data (sequential to respect rate limits)
    const trendingRes = await fetchTrendingTokens(20);
    await new Promise((r) => setTimeout(r, 1500));
    const listingsRes = await fetchNewListings(20);

    const newAddresses = new Set(extractArray(listingsRes).map((t: any) => t?.address));
    const tokens = extractArray(trendingRes)
      .slice(0, 15)
      .map((t: any) => mapToToken(t, newAddresses.has(t?.address)));

    // 2. Safety scores (heuristic, no extra API calls)
    tokens.forEach((t) => { t.safetyScore = estimateSafetyScore(t); });

    // 3. AI analysis for top 5
    if (withAi) {
      for (const token of tokens.slice(0, 5)) {
        const ai = await analyzeToken(token);
        token.aiAnalysis = ai.analysis;
        token.signal = ai.signal;
      }
    }

    // 4. Telegram alerts (dedup by address)
    let alertsSent = 0;
    if (withAlerts) {
      for (const token of tokens) {
        if ((token.signal === 'STRONG_BUY' || token.signal === 'BUY') && !alertedTokens.has(token.address)) {
          const alert: TelegramAlert = {
            symbol: token.symbol,
            name: token.name,
            price: token.price,
            priceChange24h: token.priceChange24h,
            volume24h: token.volume24h,
            volumeChange24h: token.volumeChange24h,
            signal: token.signal,
            analysis: token.aiAnalysis ?? '',
            confidence: 0.7,
            safetyScore: token.safetyScore,
          };
          if (await sendAlert(alert)) {
            alertsSent++;
            alertedTokens.add(token.address);
          }
        }
      }
    }

    const apiCalls = 2 + (withAi ? Math.min(tokens.length, 5) : 0);

    return NextResponse.json({
      tokens,
      meta: { apiCalls, alertsSent, timestamp: new Date().toISOString(), aiEnabled: withAi, alertsEnabled: withAlerts },
    });
  } catch (error: any) {
    console.error('Scan error:', error?.message);
    return NextResponse.json({ error: error?.message ?? 'Scan failed' }, { status: 500 });
  }
}
