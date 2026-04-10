import React from 'react';
import { FileText, Calculator, CreditCard, Settings, CheckCircle } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';

const icons = [FileText, Calculator, CreditCard, Settings, CheckCircle];

export function HowItWorksSection() {
  const { t } = useLocale();

  return (
    <section id="how-it-works" className="py-12 sm:py-16 md:py-20 bg-[var(--bg-primary)] border-t border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-sora text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3 sm:mb-4">
            {t.howItWorks.title}
          </h2>
          <p className="text-[var(--text-muted)]">{t.howItWorks.subtitle}</p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-[var(--border-color)] -z-10">
            <div className="absolute top-0 left-0 h-full bg-[#B6FF2E] w-1/2 opacity-20" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
            {t.howItWorks.steps.map((step, index) => {
              const Icon = icons[index];
              return (
                <div key={index} className="relative flex flex-col items-center text-center group">
                  <div
                    className="how-step-circle w-24 h-24 rounded-full bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] group-hover:border-[#B6FF2E] flex items-center justify-center mb-6 transition-colors duration-300 z-10"
                    style={{ animationDelay: `${index * 0.4}s` }}
                  >
                    <Icon className="how-step-icon h-8 w-8 text-[var(--text-muted)] group-hover:text-[#B6FF2E] transition-colors" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-center text-sm font-mono font-bold text-[var(--text-primary)]">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{step.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-[200px]">{step.desc}</p>
                  {index < t.howItWorks.steps.length - 1 && (
                    <div className="lg:hidden absolute bottom-[-32px] left-1/2 w-0.5 h-8 bg-[var(--border-color)]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
