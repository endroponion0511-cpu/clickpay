import { useState, useEffect, useCallback } from 'react';

const API_URL = 'https://open.er-api.com/v6/latest/USD';
const UPDATE_INTERVAL_MS = 3000;
const VARIANCE = 0.003; // ±0.3% для имитации внутридневных колебаний

export interface RateItem {
  pair: string;
  symbol: string;  // $ € ₽ ₮ — знаки валют для бейджа
  rate: string;
  change: string;
  up: boolean;
}

interface ApiRates {
  rates: Record<string, number>;
}

function addVariance(base: number, variance: number = VARIANCE): { value: number; change: number } {
  const delta = (Math.random() - 0.5) * 2 * variance * base;
  const newValue = base + delta;
  const changePercent = (delta / base) * 100;
  return {
    value: Math.round(newValue * 100) / 100,
    change: changePercent,
  };
}

export function useExchangeRates(): { rates: RateItem[]; loading: boolean; error: string | null } {
  const [baseRates, setBaseRates] = useState<{
    usdThb: number;
    eurThb: number;
    rubThb: number;
  } | null>(null);
  const [rates, setRates] = useState<RateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Ошибка загрузки курсов');
      const data: ApiRates = await res.json();
      const { rates: r } = data;

      // USD/THB, EUR/THB (через USD), RUB/THB (через USD)
      const usdThb = r.THB ?? 31.54;
      const eurUsd = r.EUR ?? 0.859;
      const eurThb = usdThb / eurUsd;
      const rubUsd = r.RUB ?? 77.85;
      const rubThb = usdThb / rubUsd;

      setBaseRates({ usdThb, eurThb, rubThb });
      setError(null);
    } catch (e) {
      setError('Не удалось загрузить курсы');
      setBaseRates({
        usdThb: 31.54,
        eurThb: 36.75,
        rubThb: 0.405,
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
      const u1 = addVariance(baseRates.usdThb);
      const u2 = addVariance(baseRates.eurThb);
      const u3 = addVariance(baseRates.rubThb);
      const u4 = addVariance(baseRates.usdThb, 0.005); // USDT ближе к USD

      setRates([
        { pair: 'USD / THB', symbol: '$', rate: u1.value.toFixed(2), change: `${u1.change >= 0 ? '+' : ''}${u1.change.toFixed(2)}%`, up: u1.change >= 0 },
        { pair: 'EUR / THB', symbol: '€', rate: u2.value.toFixed(2), change: `${u2.change >= 0 ? '+' : ''}${u2.change.toFixed(2)}%`, up: u2.change >= 0 },
        { pair: 'RUB / THB', symbol: '₽', rate: u3.value.toFixed(4), change: `${u3.change >= 0 ? '+' : ''}${u3.change.toFixed(2)}%`, up: u3.change >= 0 },
        { pair: 'USDT / THB', symbol: '₮', rate: u4.value.toFixed(2), change: `${u4.change >= 0 ? '+' : ''}${u4.change.toFixed(2)}%`, up: u4.change >= 0 },
      ]);
    };

    updateRates();
    const interval = setInterval(updateRates, UPDATE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [baseRates]);

  return { rates, loading, error };
}
