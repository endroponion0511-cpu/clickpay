import React from 'react';
import { ArrowRight } from 'lucide-react';
import { serviceIcons3D } from './services/ServiceIcons3D';
import { useLocale } from '../contexts/LocaleContext';

export function ServicesSection() {
  const { t } = useLocale();

  return (
    <section id="services" className="py-12 sm:py-16 md:py-20 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:mb-12 md:mb-14">
          <h2 className="font-sora text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2 tracking-tight">
            {t.services.title}
          </h2>
          <p className="max-w-2xl text-[var(--text-muted)] text-[0.9375rem] sm:text-base leading-relaxed">
            {t.services.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {t.services.items.map((service, i) => {
            const Icon = serviceIcons3D[i] ?? serviceIcons3D[0];
            return (
              <article key={i} className="service-glass-card group flex flex-col">
                <div className="mb-5 flex items-start">
                  <div className="service-3d-pedestal" aria-hidden="true">
                    <Icon />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="mb-2.5 font-sora text-lg font-bold tracking-tight text-[var(--text-primary)] transition-colors duration-300 group-hover:text-[#B6FF2E] sm:text-xl">
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--text-muted)] sm:text-[0.9375rem]">
                    {service.desc}
                  </p>
                </div>
                <div className="mt-6 border-t border-[color-mix(in_srgb,var(--border-color)_70%,transparent)] pt-5">
                  <button
                    type="button"
                    className="group/btn inline-flex items-center text-sm font-semibold tracking-wide text-[var(--text-primary)] transition-colors hover:text-[#B6FF2E]"
                  >
                    <span className="border-b border-transparent transition-colors group-hover/btn:border-[#B6FF2E]/50">
                      {t.services.submit}
                    </span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
