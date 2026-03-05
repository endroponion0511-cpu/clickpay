/**
 * Netlify serverless function: sends form data to Telegram.
 * Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Netlify env vars.
 */
export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Server misconfiguration: Telegram credentials not set',
      }),
    };
  }

  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
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
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: data.description || 'Telegram API error',
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: e.message || 'Failed to send to Telegram',
      }),
    };
  }
}
