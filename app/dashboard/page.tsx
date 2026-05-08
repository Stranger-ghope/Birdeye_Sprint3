'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import type { MemeToken, ScanMeta } from '@/lib/types';

const REFRESH_INTERVAL = 120_000; // 2 min to respect rate limits

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
}

function formatPercent(num: number): string {
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
}

function getSignalBadge(signal: string | null) {
  switch (signal) {
    case 'STRONG_BUY':
      return <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-0.5 rounded">🟢🟢 STRONG BUY</span>;
    case 'BUY':
      return <span className="bg-green-500/10 text-green-400 text-xs font-bold px-2 py-0.5 rounded">🟢 BUY</span>;
    case 'WATCH':
      return <span className="bg-yellow-500/10 text-yellow-400 text-xs font-bold px-2 py-0.5 rounded">🟡 WATCH</span>;
    case 'AVOID':
      return <span className="bg-red-500/10 text-red-400 text-xs font-bold px-2 py-0.5 rounded">🔴 AVOID</span>;
    default:
      return <span className="bg-gray-500/10 text-gray-400 text-xs px-2 py-0.5 rounded">⏳ Scanning...</span>;
  }
}

function getSafetyColor(score: number | null): string {
  if (score === null) return 'text-gray-500';
  if (score >= 70) return 'text-green-400';
  if (score >= 40) return 'text-yellow-400';
  return 'text-red-400';
}

export default function Dashboard() {
  const [tokens, setTokens] = useState<MemeToken[]>([]);
  const [meta, setMeta] = useState<ScanMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalApiCalls, setTotalApiCalls] = useState(0);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(false);

  // Persist API call count
  useEffect(() => {
    const saved = localStorage.getItem('memeradar_apiCalls');
    if (saved) setTotalApiCalls(parseInt(saved, 10));
  }, []);

  useEffect(() => {
    localStorage.setItem('memeradar_apiCalls', totalApiCalls.toString());
  }, [totalApiCalls]);

  const fetchTokens = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (aiEnabled) params.set('ai', 'true');
      if (alertsEnabled) params.set('alerts', 'true');

      const res = await fetch(`/api/scan?${params.toString()}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || 'Scan failed');
      }

      const data = await res.json();
      setTokens(data.tokens ?? []);
      setMeta(data.meta ?? null);
      setTotalApiCalls((prev) => prev + (data.meta?.apiCalls ?? 0));
    } catch (err: any) {
      setError(err?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [aiEnabled, alertsEnabled]);

  useEffect(() => {
    fetchTokens();
    const interval = window.setInterval(fetchTokens, REFRESH_INTERVAL);
    return () => window.clearInterval(interval);
  }, [fetchTokens]);

  const shareToX = (token: MemeToken) => {
    const msg = `📡 MemeRadar Signal: ${token.signal ?? 'SCANNING'}\n\n$${token.symbol} — ${token.name}\n💰 $${token.price.toFixed(6)} (${formatPercent(token.priceChange24h)})\n📊 Vol: ${formatNumber(token.volume24h)} (${formatPercent(token.volumeChange24h)})\n🛡️ Safety: ${token.safetyScore ?? '...'}/100\n\n${token.aiAnalysis ?? ''}\n\n#BirdeyeAPI @birdeye_data`;
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#1a2235]">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#00ffc8] text-2xl font-bold tracking-tight">📡 MEMERADAR</span>
          <span className="text-xs text-gray-500 mt-1">.ai</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0a0f1a] border border-[#1a2235] rounded-lg px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00ffc8] animate-pulse-glow" />
            <span className="text-xs text-gray-400">
              API Calls: <span className={`font-bold ${totalApiCalls >= 50 ? 'text-[#00ffc8]' : 'text-white'}`}>{totalApiCalls}</span>
              {totalApiCalls >= 50 && <span className="text-[#00ffc8] ml-1">✓</span>}
            </span>
          </div>
          <a
            href="https://t.me/memeradar_signals"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#00ffc8] text-black font-semibold text-sm px-4 py-2 rounded-lg hover:bg-[#00e6b4] transition-colors"
          >
            Join Telegram
          </a>
        </div>
      </nav>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Live Meme Radar</h1>
            <p className="text-gray-400 text-sm">
              Auto-refresh every 60s • {meta?.timestamp ? new Date(meta.timestamp).toLocaleTimeString() : 'Loading...'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={aiEnabled}
                onChange={(e) => setAiEnabled(e.target.checked)}
                className="accent-[#00ffc8]"
              />
              <span className="text-sm text-gray-400">🤖 AI Analysis</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={alertsEnabled}
                onChange={(e) => setAlertsEnabled(e.target.checked)}
                className="accent-[#00ffc8]"
              />
              <span className="text-sm text-gray-400">📲 Telegram Alerts</span>
            </label>
            <button
              onClick={fetchTokens}
              disabled={loading}
              className="bg-[#0a0f1a] border border-[#1a2235] text-white px-4 py-2 rounded-lg text-sm hover:border-[#00ffc8] transition-colors disabled:opacity-50"
            >
              {loading ? 'Scanning...' : 'Refresh now'}
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        </div>
      )}

      {/* Token Table */}
      <div className="max-w-7xl mx-auto px-6 pb-10">
        <div className="bg-[#0a0f1a] border border-[#1a2235] rounded-xl overflow-hidden mt-4">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-[#1a2235]">
                <th className="text-left px-4 py-3">Token</th>
                <th className="text-left px-4 py-3">Signal</th>
                <th className="text-right px-4 py-3">Price</th>
                <th className="text-right px-4 py-3">24h Change</th>
                <th className="text-right px-4 py-3">Volume 24h</th>
                <th className="text-right px-4 py-3">Vol Change</th>
                <th className="text-center px-4 py-3">Safety</th>
                <th className="text-left px-4 py-3">AI Analysis</th>
                <th className="text-center px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token, i) => (
                <tr
                  key={token.address || i}
                  className="border-b border-[#1a2235]/50 hover:bg-[#0d1525] transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">{token.symbol}</span>
                      {token.isNew && (
                        <span className="bg-[#00ffc8]/10 text-[#00ffc8] text-[10px] font-bold px-1.5 py-0.5 rounded">NEW</span>
                      )}
                    </div>
                    <span className="text-gray-500 text-xs">#{token.rank} • {token.name}</span>
                  </td>
                  <td className="px-4 py-3">{getSignalBadge(token.signal)}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm">
                    ${token.price < 0.01 ? token.price.toFixed(6) : token.price.toFixed(4)}
                  </td>
                  <td className={`px-4 py-3 text-right text-sm font-semibold ${token.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatPercent(token.priceChange24h)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-300">
                    {formatNumber(token.volume24h)}
                  </td>
                  <td className={`px-4 py-3 text-right text-sm font-semibold ${token.volumeChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatPercent(token.volumeChange24h)}
                  </td>
                  <td className={`px-4 py-3 text-center text-sm font-bold ${getSafetyColor(token.safetyScore)}`}>
                    {token.safetyScore !== null ? `${token.safetyScore}/100` : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400 max-w-[280px]">
                    <span className="line-clamp-3">{token.aiAnalysis ?? '—'}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => shareToX(token)}
                      className="bg-[#0a0f1a] border border-[#1a2235] text-[#00ffc8] text-xs px-3 py-1.5 rounded hover:border-[#00ffc8] transition-colors"
                    >
                      Share to X
                    </button>
                  </td>
                </tr>
              ))}
              {tokens.length === 0 && !loading && (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-gray-500">
                    No tokens found. Check your API key.
                  </td>
                </tr>
              )}
              {loading && tokens.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-gray-500">
                    <span className="animate-pulse">📡 Scanning Solana for meme tokens...</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Stats */}
        {meta && (
          <div className="flex items-center gap-6 mt-4 text-xs text-gray-500">
            <span>API calls this scan: {meta.apiCalls}</span>
            <span>Total API calls: {totalApiCalls}</span>
            {meta.alertsSent > 0 && <span className="text-[#00ffc8]">📲 {meta.alertsSent} alerts sent to Telegram</span>}
            <span>AI: {meta.aiEnabled ? '✅' : '❌'}</span>
            <span>Alerts: {meta.alertsEnabled ? '✅' : '❌'}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1a2235] px-6 py-4 text-center text-gray-500 text-xs">
        MemeRadar.ai — Powered by Birdeye API + Groq AI • Auto-refresh every 60s
      </footer>
    </div>
  );
}
