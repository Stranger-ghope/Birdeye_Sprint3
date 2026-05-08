import type { TelegramAlert } from './types';

const TELEGRAM_API = 'https://api.telegram.org';

function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error('Missing TELEGRAM_BOT_TOKEN');
  return token;
}

function getChatId(): string {
  const id = process.env.TELEGRAM_CHAT_ID;
  if (!id) throw new Error('Missing TELEGRAM_CHAT_ID');
  return id;
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
}

const SIGNAL_EMOJI: Record<string, string> = {
  STRONG_BUY: '🟢🟢',
  BUY: '🟢',
  WATCH: '🟡',
  AVOID: '🔴',
};

function formatMessage(alert: TelegramAlert): string {
  const emoji = SIGNAL_EMOJI[alert.signal] ?? '⚪';
  const ps = alert.priceChange24h >= 0 ? '+' : '';
  const vs = alert.volumeChange24h >= 0 ? '+' : '';

  return `${emoji} *MemeRadar Signal: ${alert.signal}*

*${alert.symbol}* — ${alert.name}

💰 Price: \`$${alert.price.toFixed(6)}\` (${ps}${alert.priceChange24h.toFixed(2)}%)
📊 Volume 24h: ${formatNumber(alert.volume24h)} (${vs}${alert.volumeChange24h.toFixed(2)}%)
🛡️ Safety: ${alert.safetyScore !== null ? `${alert.safetyScore}/100` : 'Checking...'}
🤖 AI Confidence: ${(alert.confidence * 100).toFixed(0)}%

📝 _${alert.analysis}_

Powered by #BirdeyeAPI | @MemeRadarAI`;
}

export async function sendAlert(alert: TelegramAlert): Promise<boolean> {
  try {
    const res = await fetch(`${TELEGRAM_API}/bot${getBotToken()}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: getChatId(),
        text: formatMessage(alert),
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      }),
    });

    if (!res.ok) {
      console.error('Telegram send failed:', await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error('Telegram error:', err);
    return false;
  }
}
