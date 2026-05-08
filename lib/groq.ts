import type { MemeToken, AISignal } from './types';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';

function getGroqKey(): string {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error('Missing GROQ_API_KEY');
  return key;
}

function buildPrompt(token: MemeToken): string {
  return `You are MemeRadar, an expert meme token analyst on Solana. Analyze this token and provide a trading signal.

TOKEN DATA:
- Symbol: ${token.symbol}
- Name: ${token.name}
- Price: $${token.price}
- 24h Price Change: ${token.priceChange24h?.toFixed(2)}%
- 24h Volume: $${token.volume24h?.toLocaleString()}
- 24h Volume Change: ${token.volumeChange24h?.toFixed(2)}%
- Market Cap: $${token.marketCap?.toLocaleString()}
- Liquidity: $${token.liquidity?.toLocaleString()}
- Is New Listing: ${token.isNew}
- Safety Score: ${token.safetyScore ?? 'Unknown'}

Respond in EXACTLY this JSON format, no other text:
{
  "signal": "STRONG_BUY" | "BUY" | "WATCH" | "AVOID",
  "analysis": "One sentence explanation (max 100 chars)",
  "confidence": 0.0 to 1.0
}

Rules:
- STRONG_BUY: Volume surging >200%, safe token, strong momentum
- BUY: Volume up >50%, decent safety, positive momentum
- WATCH: Mixed signals, moderate volume, needs monitoring
- AVOID: Low safety score, suspicious metrics, low liquidity`;
}

export async function analyzeToken(token: MemeToken): Promise<AISignal> {
  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getGroqKey()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: buildPrompt(token) }],
        temperature: 0.3,
        max_tokens: 150,
      }),
    });

    if (!res.ok) throw new Error(`Groq API error: ${res.status}`);

    const data = await res.json();
    const parsed = JSON.parse(data.choices?.[0]?.message?.content?.trim());

    return {
      signal: parsed.signal || 'WATCH',
      analysis: parsed.analysis || 'Unable to determine signal.',
      confidence: parsed.confidence || 0.5,
    };
  } catch (err) {
    console.error('AI analysis failed:', err);
    return { signal: 'WATCH', analysis: 'AI analysis unavailable.', confidence: 0 };
  }
}
