import React from 'react';
import { Globe, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { useLocale } from '../contexts/LocaleContext';

export function DirectionsSection() {
  const { t } = useLocale();
  const { table, rows, active, clarify } = t.directions;

  return (
    <section id="directions" className="py-12 sm:py-16 md:py-20 bg-[var(--bg-primary)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="font-sora text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3 sm:mb-4">
            {t.directions.title}
          </h2>
          <p className="text-[var(--text-muted)] max-w-2xl">{t.directions.subtitle}</p>
        </div>

        <div className="hidden lg:block overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-tertiary)] border-b border-[var(--border-color)]">
                <th className="py-4 px-6 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{table.region}</th>
                <th className="py-4 px-6 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{table.countries}</th>
                <th className="py-4 px-6 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{table.currencies}</th>
                <th className="py-4 px-6 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{table.status}</th>
                <th className="py-4 px-6 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{table.time}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {rows.map((row) => (
                <tr key={row.region} className="group hover:bg-[var(--bg-tertiary)] transition-colors">
                  <td className="py-4 px-6 text-[var(--text-primary)] font-medium">
                    <span className="inline-flex items-center gap-3">
                      <Globe className="h-4 w-4 flex-shrink-0 text-[var(--text-muted)] group-hover:text-[#B6FF2E]" />
                      {row.region}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-[var(--text-muted)]">{row.countries}</td>
                  <td className="py-4 px-6 text-[var(--text-primary)] font-mono text-sm">{row.currencies}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#B6FF2E]/10 text-[#B6FF2E] border border-[#B6FF2E]/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B6FF2E] animate-pulse" />
                      {active}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-[var(--text-muted)] font-mono text-sm">
                    <span className="inline-flex items-center gap-2">
                      <Clock className="h-3 w-3 flex-shrink-0" />
                      {row.time}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden space-y-4">
          {rows.map((row) => (
            <Card key={row.region} className="bg-[var(--bg-secondary)]">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-[#B6FF2E]" />
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">{row.region}</h3>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-[#B6FF2E]/10 text-[#B6FF2E] border border-[#B6FF2E]/20">
                  {active}
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-[var(--text-muted)] mb-1">{table.countries}</div>
                  <div className="text-sm text-[var(--text-primary)]">{row.countries}</div>
                </div>
                <div className="flex justify-between">
                  <div>
                    <div className="text-xs text-[var(--text-muted)] mb-1">{table.currencies}</div>
                    <div className="text-sm font-mono text-[var(--text-primary)]">{row.currencies}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-[var(--text-muted)] mb-1">{table.time}</div>
                    <div className="text-sm font-mono text-[var(--text-primary)]">{row.time}</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button variant="outline" onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}>
            {clarify}
          </Button>
        </div>
      </div>
    </section>
  );
}
