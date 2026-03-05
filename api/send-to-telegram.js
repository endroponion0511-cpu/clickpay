/**
 * Vercel serverless function: sends form data to Telegram.
 * Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Vercel env vars.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({
      error: 'Server misconfiguration: Telegram credentials not set',
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { name, contact, message, source = 'CTA form' } = body;

    const text = [
      `📩 *Новая заявка* (${source})`,
      '',
      `👤 *Имя:* ${name || '—'}`,
      `📞 *Контакт:* ${contact || '—'}`,
      `💬 *Сообщение:* ${message || '—'}`,
    ].join('\n');

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      }),
    });

    const data = await resp.json();
    if (!data.ok) {
      return res.status(500).json({
        error: data.description || 'Telegram API error',
      });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({
      error: e.message || 'Failed to send to Telegram',
    });
  }
}
