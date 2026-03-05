import { useState, useEffect, useCallback } from 'react';

const API_URL = 'https://open.er-api.com/v6/latest/USD';
const UPDATE_INTERVAL_MS = 3000; // обновление каждые 3 секунды
const VARIANCE = 0.002; // ±0.2% для имитации колебаний

function addVariance(base: number, variance: number = VARIANCE): number {
  const delta = (Math.random() - 0.5) * 2 * variance * base;
  return Math.round((base + delta) * 10000) / 10000;
}

export function useCalculatorRates(): {
  rates: Record<string, number>;
  loading: boolean;
  error: string | null;
} {
  const [baseRates, setBaseRates] = useState<Record<string, number> | null>(null);
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Ошибка загрузки курсов');
      const data: { rates: Record<string, number> } = await res.json();
      const r = data.rates;

      const usdThb = r.THB ?? 31.54;
      const eurUsd = r.EUR ?? 0.859;
      const rubUsd = r.RUB ?? 77.85;

      const eurThb = usdThb / eurUsd;
      const rubThb = usdThb / rubUsd;
      const usdtThb = usdThb;

      const thbUsd = 1 / usdThb;
      const thbEur = 1 / eurThb;
      const thbRub = 1 / rubThb;
      const thbUsdt = thbUsd;

      const rubUsdRate = 1 / rubUsd;
      const rubEur = rubUsdRate * (1 / eurUsd);
      const eurRub = 1 / rubEur;
      const usdRub = rubUsd;
      const eurUsdRate = eurUsd;
      const usdEur = 1 / eurUsd;

      setBaseRates({
        'RUB-THB': rubThb, 'USD-THB': usdThb, 'EUR-THB': eurThb, 'USDT-THB': usdtThb,
        'THB-RUB': thbRub, 'THB-USD': thbUsd, 'THB-EUR': thbEur, 'THB-USDT': thbUsdt,
        'RUB-USD': rubUsdRate, 'RUB-EUR': rubEur, 'RUB-USDT': rubUsdRate,
        'USD-RUB': usdRub, 'USD-EUR': usdEur, 'USD-USDT': 1,
        'EUR-USD': eurUsdRate, 'EUR-RUB': eurRub, 'EUR-USDT': eurUsdRate,
        'USDT-RUB': usdRub, 'USDT-USD': 1, 'USDT-EUR': usdEur,
      });
      setError(null);
    } catch (e) {
      setError('Не удалось загрузить курсы');
      setBaseRates({
        'RUB-THB': 0.405, 'USD-THB': 31.54, 'EUR-THB': 36.75, 'USDT-THB': 31.54,
        'THB-RUB': 2.47, 'THB-USD': 0.0317, 'THB-EUR': 0.0272, 'THB-USDT': 0.0317,
        'RUB-USD': 0.0128, 'RUB-EUR': 0.011, 'RUB-USDT': 0.0128,
        'USD-RUB': 77.85, 'USD-EUR': 0.859, 'USD-USDT': 1,
        'EUR-USD': 1.164, 'EUR-RUB': 90.6, 'EUR-USDT': 1.164,
        'USDT-RUB': 77.85, 'USDT-USD': 1, 'USDT-EUR': 0.859,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  useEffect(() => {
    if (!baseRates) return;

    const updateRates = () => {
      const next: Record<string, number> = {};
      for (const [key, val] of Object.entries(baseRates)) {
        next[key] = addVariance(val);
      }
      setRates(next);
    };

    updateRates();
    const interval = setInterval(updateRates, UPDATE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [baseRates]);

  return { rates, loading, error };
}
