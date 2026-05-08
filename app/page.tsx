import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#1a2235]">
        <div className="flex items-center gap-2">
          <span className="text-[#00ffc8] text-2xl font-bold tracking-tight">📡 MEMERADAR</span>
          <span className="text-xs text-gray-500 mt-1">.ai</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <a
            href="https://t.me/memeradar_final_signal"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#00ffc8] text-black font-semibold text-sm px-4 py-2 rounded-lg hover:bg-[#00e6b4] transition-colors"
          >
            Join Telegram
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
        <div className="inline-flex items-center gap-2 bg-[#0a0f1a] border border-[#1a2235] rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#00ffc8] animate-pulse-glow" />
          <span className="text-xs text-gray-400">Live on Solana — Powered by Birdeye API</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight max-w-4xl">
          Every degen watches<br />
          <span className="text-[#00ffc8] glow-text">the chart.</span>
        </h1>
        <h2 className="text-3xl md:text-5xl font-bold text-gray-400 mt-2">
          We watch the <span className="text-white">blockchain.</span>
        </h2>

        <p className="text-gray-400 max-w-2xl mt-6 text-lg leading-relaxed">
          MemeRadar detects early meme tokens before they explode.
          AI-scored. Safety-checked. Delivered to Telegram.
        </p>

        <div className="flex items-center gap-4 mt-10">
          <a
            href="https://t.me/memeradar_final_signal"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#00ffc8] text-black font-bold px-8 py-3 rounded-lg text-lg hover:bg-[#00e6b4] transition-all glow-accent"
          >
            JOIN @MEMERADAR →
          </a>
          <Link
            href="/dashboard"
            className="border border-[#1a2235] text-gray-300 font-semibold px-8 py-3 rounded-lg text-lg hover:border-[#00ffc8] hover:text-white transition-all"
          >
            Live Dashboard
          </Link>
        </div>
      </section>

      {/* Signal Examples */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h3 className="text-center text-sm text-gray-500 uppercase tracking-widest mb-10">
          What a signal looks like
        </h3>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Strong Buy */}
          <div className="signal-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🟢🟢</span>
              <span className="text-[#00ff88] font-bold text-sm">STRONG BUY</span>
            </div>
            <p className="text-white font-semibold">$MYRO — Myro</p>
            <p className="text-gray-400 text-sm mt-1">
              Volume surging +1600%. Safety: 70/100. 51K holders.
            </p>
            <p className="text-[#00ffc8] text-xs mt-3 italic">
              &quot;High volume surge and decent safety score indicate strong momentum.&quot;
            </p>
          </div>

          {/* Watch */}
          <div className="signal-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🟡</span>
              <span className="text-yellow-400 font-bold text-sm">WATCH</span>
            </div>
            <p className="text-white font-semibold">$BONK — BonkCoin</p>
            <p className="text-gray-400 text-sm mt-1">
              Volume up +45%. Safety: 55/100. Mixed signals — needs monitoring.
            </p>
            <p className="text-gray-500 text-xs mt-3 italic">
              &quot;Moderate momentum but safety concerns. Wait for confirmation.&quot;
            </p>
          </div>

          {/* Avoid */}
          <div className="signal-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🔴</span>
              <span className="text-[#ff4d4d] font-bold text-sm">AVOID</span>
            </div>
            <p className="text-white font-semibold">$RUG — RugToken</p>
            <p className="text-gray-400 text-sm mt-1">
              Mint authority active. Top holder 90%. Safety: 15/100.
            </p>
            <p className="text-red-400 text-xs mt-3 italic">
              &quot;Freeze authority enabled and concentrated holders. High rug risk.&quot;
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-[#1a2235]">
        <h3 className="text-center text-3xl font-bold mb-12">
          How <span className="text-[#00ffc8]">MemeRadar</span> Works
        </h3>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-3">📡</div>
            <h4 className="font-bold mb-1">Scan</h4>
            <p className="text-gray-400 text-sm">
              Pulls trending tokens and new listings from Birdeye every 2 minutes.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">🛡️</div>
            <h4 className="font-bold mb-1">Check Safety</h4>
            <p className="text-gray-400 text-sm">
              Runs token security checks — mint authority, freeze, top holders.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">🤖</div>
            <h4 className="font-bold mb-1">AI Analysis</h4>
            <p className="text-gray-400 text-sm">
              Groq AI scores each token and generates a trading signal.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">📲</div>
            <h4 className="font-bold mb-1">Alert</h4>
            <p className="text-gray-400 text-sm">
              STRONG BUY and BUY signals auto-fire to Telegram.
            </p>
          </div>
        </div>
      </section>

      {/* Endpoints */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-[#1a2235]">
        <h3 className="text-center text-3xl font-bold mb-8">
          Birdeye API <span className="text-[#00ffc8]">Endpoints Used</span>
        </h3>

        <div className="grid md:grid-cols-3 gap-3 max-w-4xl mx-auto">
          {[
            { endpoint: '/defi/token_trending', desc: 'Trending tokens with volume momentum' },
            { endpoint: '/v2/tokens/new_listing', desc: 'Fresh meme token listings' },
            { endpoint: '/defi/token_security', desc: 'Mint authority, freeze, holder concentration' },
            { endpoint: '/defi/price', desc: 'Real-time token pricing' },
            { endpoint: '/defi/token_overview', desc: 'Holder count and supply data' },
            { endpoint: '/v3/token/trade-data/single', desc: '24h buy/sell trade activity' },
          ].map((item) => (
            <div key={item.endpoint} className="flex items-center gap-3 bg-[#0a0f1a] border border-[#1a2235] rounded-lg px-4 py-3">
              <span className="text-[#00ffc8]">✓</span>
              <div>
                <code className="text-sm text-white">{item.endpoint}</code>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How To Use */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-[#1a2235]">
        <h3 className="text-center text-3xl font-bold mb-10">
          Get Started in <span className="text-[#00ffc8]">3 Steps</span>
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-[#00ffc8]/10 border border-[#00ffc8]/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-[#00ffc8] font-bold text-lg">1</span>
            </div>
            <h4 className="font-bold mb-2">Open the Dashboard</h4>
            <p className="text-gray-400 text-sm">
              See live AI-scored signals for trending Solana meme tokens, updated every 2 minutes.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-[#00ffc8]/10 border border-[#00ffc8]/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-[#00ffc8] font-bold text-lg">2</span>
            </div>
            <h4 className="font-bold mb-2">Click Trade</h4>
            <p className="text-gray-400 text-sm">
              One click opens Birdeye where you can swap directly. No copy-pasting addresses.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-[#00ffc8]/10 border border-[#00ffc8]/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-[#00ffc8] font-bold text-lg">3</span>
            </div>
            <h4 className="font-bold mb-2">Join Telegram</h4>
            <p className="text-gray-400 text-sm">
              Get BUY alerts pushed to your phone with AI analysis and trade links — even when you&apos;re AFK.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-6 py-20 border-t border-[#1a2235]">
        <h3 className="text-4xl font-bold mb-4">
          Stop watching charts.<br />
          <span className="text-[#00ffc8]">Start getting signals.</span>
        </h3>
        <p className="text-gray-400 mb-8">
          Every signal drops to Telegram with a full AI breakdown and trade links. No dashboard required.
        </p>
        <a
          href="https://t.me/memeradar_final_signal"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#00ffc8] text-black font-bold px-10 py-4 rounded-lg text-lg hover:bg-[#00e6b4] transition-all glow-accent inline-block"
        >
          JOIN @MEMERADAR →
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a2235] px-6 py-6 text-center text-gray-500 text-sm">
        <p>
          Built for Birdeye Sprint 3 Hackathon — Powered by{' '}
          <a href="https://birdeye.so" target="_blank" rel="noopener noreferrer" className="text-[#00ffc8] hover:underline">
            Birdeye API
          </a>
          {' '}+{' '}
          <a href="https://groq.com" target="_blank" rel="noopener noreferrer" className="text-[#00ffc8] hover:underline">
            Groq AI
          </a>
        </p>
      </footer>
    </div>
  );
}
