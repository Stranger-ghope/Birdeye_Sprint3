const BASE_URL = 'https://public-api.birdeye.so';
const CHAIN = 'solana';

function getApiKey(): string {
  const key = process.env.NEXT_PUBLIC_BIRDEYE_API_KEY;
  if (!key) throw new Error('Missing NEXT_PUBLIC_BIRDEYE_API_KEY');
  return key;
}

async function birdeyeFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: {
      'X-API-KEY': getApiKey(),
      'x-chain': CHAIN,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Birdeye ${res.status}: ${body.slice(0, 200)}`);
  }

  return res.json() as Promise<T>;
}

export async function fetchTrendingTokens(limit = 20) {
  return birdeyeFetch<any>('/defi/token_trending', {
    sort_by: 'rank',
    sort_type: 'asc',
    offset: '0',
    limit: String(limit),
  });
}

export async function fetchNewListings(limit = 20) {
  return birdeyeFetch<any>('/defi/v2/tokens/new_listing', {
    limit: String(limit),
  });
}
