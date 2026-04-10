const API_URL = '/api/send-to-telegram';

export type TelegramApplicationPayload = {
  name: string;
  contact: string;
  message: string;
  source: string;
};

export async function submitTelegramApplication(
  payload: TelegramApplicationPayload,
  errorFallback: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    let data: { error?: string } = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      if (!res.ok) return { ok: false, error: errorFallback };
    }
    if (!res.ok) {
      return { ok: false, error: data.error || errorFallback };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: errorFallback };
  }
}
