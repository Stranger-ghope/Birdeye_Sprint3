# 📡 MemeRadar.ai

**AI-powered meme token discovery on Solana** — real-time trending tokens, safety scoring, AI trading signals, and automated Telegram alerts.

Built for [Birdeye Data Sprint 3](https://earn.superteam.fun/) using the [Birdeye API](https://docs.birdeye.so/).

> 🏆 **Birdeye Data 4-Week BIP Competition — Sprint 3 Submission**

## Live Demo

🌐 **Website:** [memeradar.vercel.app](https://memeradar.vercel.app)
📲 **Telegram Channel:** [@memeradar_final_signal](https://t.me/memeradar_final_signal)

## What It Does

MemeRadar.ai scans the Solana blockchain in real-time to surface trending and newly listed meme tokens, scores them for safety, runs AI analysis to generate trading signals, and pushes actionable alerts to Telegram — all in one dashboard.

### Pipeline

```
Birdeye API → Trending + New Listings → Security → Overview → Trade Data → Price → AI Analysis → Telegram Alerts
```

1. **Fetch trending tokens** via `/defi/token_trending`
2. **Cross-reference new listings** via `/defi/v2/tokens/new_listing`
3. **Safety scoring** via `/defi/token_security` with heuristic fallback
4. **Holder counts** via `/defi/token_overview`
5. **Buy/sell activity** via `/v3/token/trade-data/single`
6. **Real-time price verification** via `/defi/price`
7. **AI signal generation** via Groq (Llama 3.1) — classifies tokens as `STRONG_BUY`, `BUY`, `WATCH`, or `AVOID`
8. **Telegram alerts** — automatically pushes BUY/STRONG_BUY signals to a live channel

## Birdeye API Endpoints Used

| Endpoint | Purpose | Calls/Scan |
|---|---|---|
| `GET /defi/token_trending` | Fetch top trending tokens on Solana | 1 |
| `GET /defi/v2/tokens/new_listing` | Detect newly listed tokens | 1 |
| `GET /defi/token_security` | Security info (freeze, mint authority, holder concentration) | up to 5 |
| `GET /defi/price` | Real-time price verification for top tokens | up to 3 |
| `GET /defi/token_overview` | Holder count and supply data | up to 3 |
| `GET /v3/token/trade-data/single` | 24h buy/sell trade activity | up to 3 |

**6 Birdeye endpoints, ~16 API calls per scan**, auto-refreshing every 2 minutes. Reaches 50+ calls within minutes of dashboard use.

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS (dark theme, neon accents)
- **AI Engine:** Groq API (Llama 3.1 8B Instant)
- **Alerts:** Telegram Bot API
- **Data:** Birdeye Public API (Solana)
- **Deployment:** Vercel

## Project Structure

```
memeradar/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── dashboard/page.tsx       # Live token dashboard
│   └── api/scan/route.ts        # Scan pipeline API
├── lib/
│   ├── types.ts                 # Shared TypeScript types
│   ├── birdeye.ts               # Birdeye API client
│   ├── groq.ts                  # AI analysis (Groq/Llama)
│   ├── telegram.ts              # Telegram alert client
│   └── scorer.ts                # Safety scoring logic
└── README.md
```

## Getting Started

```bash
git clone https://github.com/Stranger-ghope/Birdeye_Sprint3.git
cd Birdeye_Sprint3
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_BIRDEYE_API_KEY=your_birdeye_key
GROQ_API_KEY=your_groq_key
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

Run locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page, or [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the live radar.

## Features

- **Real-time token feed** — Trending + new tokens refreshed every 2 minutes
- **Safety scoring** — On-chain security data + heuristic analysis
- **Holder & trade data** — Holder counts, 24h buy/sell activity
- **AI trading signals** — Groq-powered analysis with confidence scores
- **Trade buttons** — One-click trade on Birdeye from any signal
- **Telegram alerts** — Automated push notifications for BUY signals
- **API call tracking** — Live Birdeye call counter with 50+ proof
- **Share to X** — One-click sharing for any token signal
- **Dark mode UI** — Professional dashboard with neon accent theme

## Screenshots

_Screenshots of dashboard and Telegram alerts will be added._

## Author

Built by [@Cheeseman07](https://x.com/Cheeseman07) for Birdeye Data Sprint 3.

## Tags

`#BirdeyeAPI` `@birdeye_data` `#Solana` `#MemeTokens` `#AI`
