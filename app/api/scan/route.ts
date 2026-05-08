import { NextResponse } from 'next/server';
import { fetchTrendingTokens, fetchNewListings, fetchTokenSecurity, fetchTokenPrice, fetchTokenOverview } from '@/lib/birdeye';
import { analyzeToken } from '@/lib/groq';
import { sendAlert } from '@/lib/telegram';
import { scoreFromSecurity, scoreFromHeuristic } from '@/lib/scorer';
import type { MemeToken, TelegramAlert } from '@/lib/types';

export const dynamic = 'force-dynamic';

const alertedTokens = new Set<string>();
const DELAY = 2000;
const delay = () => new Promise((r) => setTimeout(r, DELAY));

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
    confidence: null,
    holders: null,
    buys24h: null,
    sells24h: null,
  };
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const withAi = url.searchParams.get('ai') === 'true';
    const withAlerts = url.searchParams.get('alerts') === 'true';
    let birdeyeCalls = 0;

    // 1. Fetch trending tokens (/defi/token_trending)
    const trendingRes = await fetchTrendingTokens(20);
    birdeyeCalls++;
    await delay();

    // 2. Fetch new listings (/defi/v2/tokens/new_listing)
    const listingsRes = await fetchNewListings(20);
    birdeyeCalls++;
    await delay();

    const newAddresses = new Set(extractArray(listingsRes).map((t: any) => t?.address));
    const tokens = extractArray(trendingRes)
      .slice(0, 15)
      .map((t: any) => mapToToken(t, newAddresses.has(t?.address)));

    // 3. Safety scores via /defi/token_security (top 2) with heuristic fallback
    for (const token of tokens.slice(0, 2)) {
      try {
        await delay();
        const secData = await fetchTokenSecurity(token.address);
        birdeyeCalls++;
        const info = secData?.data;
        token.safetyScore = info ? scoreFromSecurity(info) : scoreFromHeuristic(token);
      } catch {
        token.safetyScore = scoreFromHeuristic(token);
      }
    }
    // Heuristic fallback for remaining tokens
    tokens.slice(2).forEach((t) => { t.safetyScore = scoreFromHeuristic(t); });

    // 4. Token overview via /defi/token_overview (top 5 — holder count)
    for (const token of tokens.slice(0, 5)) {
      try {
        await delay();
        const overview = await fetchTokenOverview(token.address);
        birdeyeCalls++;
        if (overview?.data?.holder) token.holders = overview.data.holder;
      } catch { /* keep null */ }
    }

    // 5. Real-time price check via /defi/price (top 2)
    for (const token of tokens.slice(0, 2)) {
      try {
        await delay();
        const priceData = await fetchTokenPrice(token.address);
        birdeyeCalls++;
        if (priceData?.data?.value) {
          token.price = priceData.data.value;
        }
      } catch {
        // keep existing price from trending data
      }
    }

    // 7. AI analysis for top 5 + safety-signal enforcement
    if (withAi) {
      for (const token of tokens) {
        const ai = await analyzeToken(token);
        token.aiAnalysis = ai.analysis;
        token.confidence = ai.confidence;

        // Downgrade signal if safety is poor
        if ((token.safetyScore ?? 100) < 50 && ai.signal === 'STRONG_BUY') {
          token.signal = 'BUY';
        } else if ((token.safetyScore ?? 100) < 30 && (ai.signal === 'STRONG_BUY' || ai.signal === 'BUY')) {
          token.signal = 'WATCH';
        } else {
          token.signal = ai.signal;
        }
      }
    }

    // 8. Telegram alerts (dedup by address)
    let alertsSent = 0;
    if (withAlerts) {
      for (const token of tokens) {
        if ((token.signal === 'STRONG_BUY' || token.signal === 'BUY') && !alertedTokens.has(token.address)) {
          const alert: TelegramAlert = {
            address: token.address,
            symbol: token.symbol,
            name: token.name,
            price: token.price,
            priceChange24h: token.priceChange24h,
            volume24h: token.volume24h,
            volumeChange24h: token.volumeChange24h,
            signal: token.signal,
            analysis: token.aiAnalysis ?? '',
            confidence: token.confidence ?? 0.5,
            safetyScore: token.safetyScore,
          };
          if (await sendAlert(alert)) {
            alertsSent++;
            alertedTokens.add(token.address);
          }
        }
      }
    }

    return NextResponse.json({
      tokens,
      meta: {
        birdeyeCalls,
        apiCalls: birdeyeCalls + (withAi ? tokens.length : 0),
        alertsSent,
        timestamp: new Date().toISOString(),
        aiEnabled: withAi,
        alertsEnabled: withAlerts,
      },
    });
  } catch (error: any) {
    console.error('Scan error:', error?.message);
    return NextResponse.json({ error: error?.message ?? 'Scan failed' }, { status: 500 });
  }
}
