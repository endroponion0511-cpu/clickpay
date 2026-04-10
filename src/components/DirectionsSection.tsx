import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Button } from './ui/Button';
import { DirectionsCountryModal } from './DirectionsCountryModal';
import type { Locale } from '../i18n/translations';
import { useLocale } from '../contexts/LocaleContext';

const MAP_SRC = `${import.meta.env.BASE_URL}world-map.svg`;

/** Microstates / tiny territories — no map tooltip, no hover emphasis */
const SKIP_MAP_TOOLTIP_ISO = new Set([
  'AD', 'MC', 'SM', 'VA', 'LI', 'GI', 'GG', 'JE', 'IM', 'BM', 'VG', 'AI', 'MS', 'KY', 'TC', 'FO', 'AX',
  'BL', 'MF', 'PM', 'WF', 'TK', 'NU', 'CK', 'AQ', 'EH', 'SJ', 'BV', 'HM', 'IO', 'CC', 'CX', 'NF', 'MP',
  'AS', 'GU', 'VI', 'MH', 'FM', 'PW', 'NR', 'TV', 'KI', 'TO', 'WS', 'PN', 'GS', 'TA', 'SH', 'AC', 'UM',
]);

const FLOAT_SLIDE_SIZE = 3;
const FLOAT_INTERVAL_MS = 4500;

function chunkLines<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

/** Trim empty margin on MapSVG canvas so continents sit nearer horizontal center */
function prepareMapSvg(svgText: string): string {
  const next = svgText.replace(
    /width="1009\.6727"\s+height="665\.96301">/,
    'width="100%" height="auto" viewBox="52 0 918 665.96301" preserveAspectRatio="xMidYMid meet">'
  );
  return next === svgText ? svgText : next;
}

function pathIsoCode(path: Element): string | null {
  const raw = path.getAttribute('id');
  if (raw && /^[A-Za-z]{2}$/.test(raw)) return raw.toUpperCase();
  return null;
}

function isMicroRegionPath(path: Element): boolean {
  const code = pathIsoCode(path);
  return code != null && SKIP_MAP_TOOLTIP_ISO.has(code);
}

/** Ставит в начало строки, похожие на выбранную страну направления из списка коридоров */
function sortDestinationsByCountryLabel(countryLabel: string, destinations: string[]): string[] {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{M}/gu, '');

  const lower = norm(countryLabel);
  const namePart = lower.replace(/\s*\([a-z]{2}\)\s*$/i, '').trim();
  const isoMatch = countryLabel.match(/\(([A-Za-z]{2})\)/);
  const iso = isoMatch?.[1]?.toUpperCase() ?? '';

  return [...destinations].sort((a, b) => {
    const score = (line: string) => {
      const ln = norm(line);
      const head = ln.split(/\s*[—–\-]\s*/)[0]?.trim() ?? '';
      let s = 0;
      if (namePart && ln.includes(namePart)) s += 14;
      if (namePart && head && (namePart.includes(head) || head.includes(namePart))) s += 10;
      if (iso && line.toUpperCase().includes(iso)) s += 6;
      return s;
    };
    return score(b) - score(a);
  });
}

function formatCountryLabel(path: Element, locale: Locale): string {
  const codeRaw = path.getAttribute('id');
  const fallback = path.getAttribute('title')?.trim() || '';
  const code = codeRaw && /^[A-Za-z]{2}$/.test(codeRaw) ? codeRaw.toUpperCase() : null;
  let name = fallback;
  if (code) {
    try {
      const lang = locale === 'en' ? 'en-US' : 'ru-RU';
      const localized = new Intl.DisplayNames([lang], { type: 'region' }).of(code);
      if (localized) name = localized;
    } catch {
      /* keep fallback */
    }
  }
  if (!name && code) return code;
  if (code) return `${name} (${code})`;
  return name;
}

function tooltipPosition(clientX: number, clientY: number) {
  const edge = Math.max(12, (window.visualViewport?.offsetLeft ?? 0) + 8);
  const pad = 14;
  const estW = 220;
  const estH = 48;
  const vw = window.visualViewport?.width ?? window.innerWidth;
  const vh = window.visualViewport?.height ?? window.innerHeight;
  let x = clientX + pad;
  let y = clientY + pad;
  if (x + estW > vw - edge) x = clientX - estW - pad;
  if (y + estH > vh - edge) y = clientY - estH - pad;
  return { x: Math.max(edge, x), y: Math.max(edge, y) };
}

export function DirectionsSection() {
  const { t, locale } = useLocale();
  const { clarify, floatingTitle, floatingDestinations } = t.directions;
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInnerRef = useRef<HTMLDivElement>(null);
  const loadStartedRef = useRef(false);
  const [mapMarkup, setMapMarkup] = useState<string | null>(null);
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const [countryModalLabel, setCountryModalLabel] = useState<string | null>(null);

  const floatSlides = useMemo(
    () => chunkLines(floatingDestinations, FLOAT_SLIDE_SIZE),
    [locale, floatingDestinations]
  );
  const [floatIndex, setFloatIndex] = useState(0);

  const openCountryModalForPath = useCallback(
    (target: Element) => {
      if (target.tagName.toLowerCase() !== 'path') return;
      if (isMicroRegionPath(target)) return;
      const text = formatCountryLabel(target, locale);
      if (!text) return;
      setTooltip(null);
      setCountryModalLabel(text);
    },
    [locale]
  );

  const showTooltipForPath = useCallback(
    (target: Element, clientX: number, clientY: number) => {
      if (target.tagName.toLowerCase() !== 'path') {
        setTooltip(null);
        return;
      }
      if (isMicroRegionPath(target)) {
        setTooltip(null);
        return;
      }
      const text = formatCountryLabel(target, locale);
      if (!text) {
        setTooltip(null);
        return;
      }
      const { x, y } = tooltipPosition(clientX, clientY);
      setTooltip({ text, x, y });
    },
    [locale]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;

    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting) || loadStartedRef.current) return;
        loadStartedRef.current = true;
        obs.disconnect();
        setLoadState('loading');
        fetch(MAP_SRC)
          .then((r) => {
            if (!r.ok) throw new Error(String(r.status));
            return r.text();
          })
          .then((text) => {
            if (cancelled) return;
            setMapMarkup(prepareMapSvg(text));
            setLoadState('idle');
          })
          .catch(() => {
            if (cancelled) return;
            setLoadState('error');
          });
      },
      { rootMargin: '120px' }
    );
    obs.observe(el);
    return () => {
      cancelled = true;
      obs.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    if (!mapMarkup || !mapInnerRef.current) return;
    mapInnerRef.current.querySelectorAll('path').forEach((el) => {
      el.classList.toggle('directions-map-micro', isMicroRegionPath(el));
      if (isMicroRegionPath(el)) {
        el.removeAttribute('aria-label');
        el.setAttribute('aria-hidden', 'true');
      } else {
        el.removeAttribute('aria-hidden');
        const label = formatCountryLabel(el, locale);
        if (label) el.setAttribute('aria-label', label);
      }
    });
  }, [mapMarkup, locale]);

  useEffect(() => {
    if (floatSlides.length <= 1) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    const id = window.setInterval(
      () => setFloatIndex((i) => (i + 1) % floatSlides.length),
      FLOAT_INTERVAL_MS
    );
    return () => window.clearInterval(id);
  }, [floatSlides.length]);

  useEffect(() => {
    setFloatIndex(0);
  }, [locale]);

  useEffect(() => {
    if (!tooltip) return;
    const dismiss = () => setTooltip(null);
    const vv = window.visualViewport;
    window.addEventListener('scroll', dismiss, true);
    vv?.addEventListener('resize', dismiss);
    return () => {
      window.removeEventListener('scroll', dismiss, true);
      vv?.removeEventListener('resize', dismiss);
    };
  }, [tooltip]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    showTooltipForPath(e.target as Element, e.clientX, e.clientY);
  };

  const handlePointerLeave = () => setTooltip(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as Element;
    if (target.tagName.toLowerCase() !== 'path') {
      setTooltip(null);
      return;
    }
    if (e.pointerType === 'touch') {
      e.stopPropagation();
      setTooltip(null);
      openCountryModalForPath(target);
    }
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    openCountryModalForPath(e.target as Element);
  };

  const currentFloat = floatSlides[floatIndex] ?? [];

  return (
    <section
      id="directions"
      className="scroll-mt-[min(5rem,12vh)] py-10 sm:py-14 md:py-20 bg-[var(--bg-primary)] relative pb-[max(2.5rem,env(safe-area-inset-bottom,0px))]"
    >
      <div className="max-w-7xl mx-auto w-full px-3 min-[400px]:px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h2 className="font-sora text-[clamp(1.375rem,4.5vw,2.25rem)] sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3 sm:mb-4 text-balance break-words">
            {t.directions.title}
          </h2>
          <p className="text-[var(--text-muted)] max-w-2xl text-pretty text-[0.9375rem] sm:text-base leading-relaxed">
            {t.directions.subtitle}
          </p>
        </div>

        <div
          ref={containerRef}
          className="directions-map-wrap min-h-[min(42vw,220px)] sm:min-h-[200px]"
          aria-busy={loadState === 'loading'}
        >
          {loadState === 'error' && (
            <div className="directions-map-fallback flex min-h-[240px] items-center justify-center px-6 py-16 text-center text-[var(--text-muted)] text-sm">
              {t.directions.mapLoadError}
            </div>
          )}

          {loadState !== 'error' && (
            <div className="directions-map-stage">
              {loadState === 'loading' && !mapMarkup && (
                <div
                  className="directions-map-skeleton w-full animate-pulse rounded-lg bg-[var(--text-primary)]/[0.06]"
                  style={{ aspectRatio: '1009 / 666' }}
                />
              )}
              {mapMarkup && (
                <div
                  ref={mapInnerRef}
                  className="directions-map-inner"
                  onPointerMove={handlePointerMove}
                  onPointerLeave={handlePointerLeave}
                  onPointerDown={handlePointerDown}
                  onClick={handleMapClick}
                  dangerouslySetInnerHTML={{ __html: mapMarkup }}
                />
              )}
              <aside className="directions-float-panel" aria-label={floatingTitle} aria-live="polite">
                <p className="directions-float-panel__title">{floatingTitle}</p>
                <ul className="directions-float-panel__list" key={floatIndex}>
                  {currentFloat.map((line) => (
                    <li key={`${floatIndex}-${line}`} className="directions-float-panel__item">
                      {line}
                    </li>
                  ))}
                </ul>
                {floatSlides.length > 1 && (
                  <div className="directions-float-panel__dots" aria-hidden="true">
                    {floatSlides.map((_, i) => (
                      <span key={i} className={i === floatIndex ? 'is-active' : ''} />
                    ))}
                  </div>
                )}
              </aside>
            </div>
          )}

          {loadState !== 'error' && (
            <p className="mt-3 sm:mt-4 text-center text-[0.7rem] min-[360px]:text-xs sm:text-sm text-[var(--text-muted)] max-w-xl mx-auto px-1 sm:px-2 leading-snug text-balance">
              {t.directions.mapHint}
            </p>
          )}
        </div>

        {tooltip && (
          <div
            className="directions-map-tooltip"
            style={{ left: tooltip.x, top: tooltip.y }}
            role="status"
            aria-live="polite"
          >
            {tooltip.text}
          </div>
        )}

        {countryModalLabel && (
          <DirectionsCountryModal
            key={countryModalLabel}
            countryLabel={countryModalLabel}
            corridorsHeading={floatingTitle}
            sortedCorridors={sortDestinationsByCountryLabel(countryModalLabel, floatingDestinations)}
            onClose={() => setCountryModalLabel(null)}
            onRequestQuote={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
          />
        )}

        <div className="mt-8 sm:mt-10 text-center px-1">
          <Button
            variant="outline"
            className="min-h-[44px] w-full max-w-md sm:w-auto touch-manipulation"
            onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {clarify}
          </Button>
        </div>
      </div>
    </section>
  );
}

