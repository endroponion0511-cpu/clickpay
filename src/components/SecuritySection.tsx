import React from 'react';
import { Shield, Check, Lock, FileCheck, Server } from 'lucide-react';
import { Card } from './ui/Card';
import { useLocale } from '../contexts/LocaleContext';

const icons = [Lock, FileCheck, Shield, Server, Check];

export function SecuritySection() {
  const { t } = useLocale();

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B6FF2E]/10 border border-[#B6FF2E]/20 text-[#B6FF2E] text-xs font-medium mb-6">
              <Shield size={14} />
              {t.security.badge}
            </div>
            <h2 className="font-sora text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4 sm:mb-6">
              {t.security.title} <br />
              <span className="text-[#B6FF2E]">{t.security.titleHighlight}</span>
            </h2>
            <p className="text-[var(--text-muted)] text-lg mb-8 leading-relaxed">{t.security.desc}</p>

            <div className="space-y-4">
              {t.security.features.map((text, index) => {
                const Icon = icons[index];
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[#B6FF2E]/30 transition-colors"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[#B6FF2E]">
                      <Icon size={20} />
                    </div>
                    <span className="text-[var(--text-primary)] font-medium">{text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute inset-0 bg-[#B6FF2E]/5 blur-[100px] rounded-full" />
            <Card className="relative w-full max-w-md bg-[var(--bg-secondary)]/80 backdrop-blur-sm border-[#B6FF2E]/20 p-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-[#B6FF2E]/10 flex items-center justify-center mb-6 animate-pulse">
                  <Shield className="w-12 h-12 text-[#B6FF2E]" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{t.security.guarantee}</h3>
                <p className="text-[var(--text-muted)] mb-6">{t.security.guaranteeDesc}</p>
                <div className="w-full h-1 bg-[var(--border-color)] rounded-full overflow-hidden">
                  <div className="w-full h-full bg-[#B6FF2E] animate-[shimmer_2s_infinite]" />
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-[var(--text-muted)] font-mono">
                  <span className="w-2 h-2 rounded-full bg-[#B6FF2E]" />
                  SECURE CONNECTION ESTABLISHED
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
