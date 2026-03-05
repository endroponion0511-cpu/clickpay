import React from 'react';
import { ArrowUpRight, RefreshCw, Wallet, MessageSquare, ArrowRight } from 'lucide-react';
import { Card } from './ui/Card';
import { useLocale } from '../contexts/LocaleContext';

const icons = [ArrowUpRight, RefreshCw, Wallet, MessageSquare];

export function ServicesSection() {
  const { t } = useLocale();

  return (
    <section id="services" className="py-12 sm:py-16 md:py-20 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-sora text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
              {t.services.title}
            </h2>
            <p className="text-[var(--text-muted)]">{t.services.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.services.items.map((service, i) => {
            const Icon = icons[i];
            return (
              <Card key={i} hoverEffect className="group relative flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-[var(--bg-tertiary)] rounded-lg group-hover:bg-[#B6FF2E]/10 transition-colors">
                    <Icon className="h-6 w-6 text-[var(--text-primary)] group-hover:text-[#B6FF2E] transition-colors" />
                  </div>
                  <span className="text-xs font-mono text-[var(--text-muted)]">SRV-00{i + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-[#B6FF2E] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-6">{service.desc}</p>
                </div>
                <div className="pt-6 border-t border-[var(--border-color)] mt-auto">
                  <button className="flex items-center text-sm font-medium text-[var(--text-primary)] group-hover:text-[#B6FF2E] transition-colors">
                    {t.services.submit}
                    <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
