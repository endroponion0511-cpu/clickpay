import React, { useEffect, useState } from 'react';
import { ArrowRightLeft, Info } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useCalculatorRates } from '../hooks/useCalculatorRates';
import { useLocale } from '../contexts/LocaleContext';

export function CalculatorSection() {
  const [amount, setAmount] = useState<string>('100000');
  const [fromCurrency, setFromCurrency] = useState('RUB');
  const [toCurrency, setToCurrency] = useState('THB');
  const [method, setMethod] = useState<'bank' | 'crypto'>('bank');
  const [result, setResult] = useState<number>(0);
  const [rate, setRate] = useState<number>(0.38);
  const COMMISSION = 0.01;
  const { rates, loading, error } = useCalculatorRates();
  const { t } = useLocale();

  useEffect(() => {
    const key = `${fromCurrency}-${toCurrency}`;
    const currentRate = rates[key] ?? (fromCurrency === toCurrency ? 1 : 0);
    setRate(currentRate);
    const numAmount = parseFloat(amount) || 0;
    const gross = numAmount * currentRate;
    setResult(gross * (1 - COMMISSION));
  }, [amount, fromCurrency, toCurrency, rates]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <section id="calculator" className="py-12 sm:py-16 md:py-20 bg-[var(--bg-primary)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-sora text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3 sm:mb-4">
            {t.calculator.title}
          </h2>
          <p className="text-[var(--text-muted)]">{t.calculator.subtitle}</p>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(182,255,46,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(182,255,46,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

          <div className="relative z-10 space-y-8">
            <div className="flex justify-center">
              <div className="bg-[var(--bg-primary)] p-1 rounded-lg border border-[var(--border-color)] inline-flex w-full sm:w-auto">
                <button
                  onClick={() => setMethod('bank')}
                  className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-2 rounded-md text-sm font-medium transition-all min-h-[44px] sm:min-h-0 ${method === 'bank' ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] shadow-sm border border-[var(--border-color)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                >
                  {t.calculator.bank}
                </button>
                <button
                  onClick={() => setMethod('crypto')}
                  className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-2 rounded-md text-sm font-medium transition-all min-h-[44px] sm:min-h-0 ${method === 'crypto' ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] shadow-sm border border-[var(--border-color)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                >
                  {t.calculator.crypto}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 sm:gap-6 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-muted)]">{t.calculator.send}</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="font-mono text-base sm:text-lg min-w-0" />
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] px-3 py-3 sm:py-0 font-bold focus:border-[#B6FF2E] focus:outline-none min-h-[44px]"
                  >
                    <option value="RUB">RUB</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="USDT">USDT</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-center pb-2">
                <button
                  onClick={handleSwap}
                  className="p-3 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[#B6FF2E] hover:border-[#B6FF2E] transition-all"
                >
                  <ArrowRightLeft size={20} />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-muted)]">{t.calculator.receive}</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg py-3 px-4 text-[var(--text-primary)] font-mono text-base sm:text-lg opacity-80 cursor-not-allowed min-h-[44px] flex items-center">
                    {result.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] px-3 py-3 sm:py-0 font-bold focus:border-[#B6FF2E] focus:outline-none min-h-[44px]"
                  >
                    <option value="THB">THB</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="RUB">RUB</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-[var(--bg-primary)] rounded-xl p-4 border border-[var(--border-color)] space-y-3">
              {error && <p className="text-xs text-amber-500/80 mb-2">{t.calculator.ratesError}</p>}
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--text-muted)]">{t.calculator.currentRate}</span>
                <span className="font-mono text-[var(--text-primary)]">
                  1 {fromCurrency} = {rate > 0 ? rate.toFixed(fromCurrency === 'RUB' || toCurrency === 'RUB' ? 4 : 2) : '—'} {toCurrency}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--text-muted)] flex items-center gap-1">
                  {t.calculator.commission} <Info size={14} />
                </span>
                <span className="font-mono text-[var(--text-primary)]">1%</span>
              </div>
              <div className="h-px bg-[var(--border-color)]" />
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-primary)] font-medium">{t.calculator.total}</span>
                <span className="font-mono text-xl font-bold text-[#B6FF2E]">
                  {result.toLocaleString(undefined, { maximumFractionDigits: 2 })} {toCurrency}
                </span>
              </div>
            </div>

            <Button
              fullWidth
              size="lg"
              className="font-bold text-lg"
              onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t.calculator.getExact}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
