import React from 'react';

/** Единый стиль: лайм + мягкая заливка, без белых пятен */
const FG = '#B6FF2E';
const FG_SOFT = 'rgba(182, 255, 46, 0.22)';
const FG_DIM = 'rgba(182, 255, 46, 0.42)';

const wrap = 'service-3d-pedestal__svg h-8 w-8 sm:h-9 sm:w-9';

/** SWIFT — межбанк: хаб + исходящая дуга */
export function ServiceSwiftIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`${wrap} ${className}`} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="22" cy="28" r="14" fill={FG_SOFT} stroke={FG} strokeWidth="2" />
      <circle cx="22" cy="28" r="6" fill="none" stroke={FG_DIM} strokeWidth="1.5" />
      <path
        d="M12 28h20M22 18v20"
        stroke={FG_DIM}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M34 20c10 2 14 12 12 22M33 21l8-4 2 8"
        stroke={FG}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Обмен — две монеты и стрелки обмена по центру */
export function ServiceExchangeIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`${wrap} ${className}`} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="17" cy="26" r="10" fill={FG_SOFT} stroke={FG} strokeWidth="2" />
      <path d="M13 26h8M17 22v8" stroke={FG} strokeWidth="2" strokeLinecap="round" />
      <circle cx="39" cy="30" r="10" fill={FG_SOFT} stroke={FG} strokeWidth="2" />
      <path
        d="M39 24c2.5 0 4.5 2 4.5 4.5S41.5 33 39 33c-1.2 0-2.3-.5-3-1.2"
        stroke={FG}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M35 32h5" stroke={FG} strokeWidth="2" strokeLinecap="round" />
      <path d="M28 10v6M25 13l3-3 3 3M28 46v-6M25 43l3 3 3-3" stroke={FG} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Крипто ↔ фиат — блокчейн-слой + монета */
export function ServiceCryptoFiatIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`${wrap} ${className}`} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8 38l10-5 10 5-10 5-10-5z" fill={FG_SOFT} stroke={FG} strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M8 29l10-5 10 5-10 5-10-5z" fill="none" stroke={FG_DIM} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 20l10-5 10 5-10 5-10-5z" fill="none" stroke={FG_DIM} strokeWidth="1.25" strokeLinejoin="round" opacity="0.7" />
      <circle cx="40" cy="30" r="12" fill={FG_SOFT} stroke={FG} strokeWidth="2" />
      <path
        d="M40 22v16M36 26h4.5a3.5 3.5 0 010 7H40M36 34h4.5a3.5 3.5 0 000 7H36"
        stroke={FG}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Консультация — наушники, читаемый силуэт */
export function ServiceConsultIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`${wrap} ${className}`} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M28 14c-7.2 0-13 5-13 12v3"
        stroke={FG_DIM}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M15 29v10c0 4 3 7 7 7h1M41 29v10c0 4-3 7-7 7h-1"
        stroke={FG}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <rect x="17" y="31" width="9" height="11" rx="2.5" fill={FG_SOFT} stroke={FG} strokeWidth="2" />
      <rect x="30" y="31" width="9" height="11" rx="2.5" fill={FG_SOFT} stroke={FG} strokeWidth="2" />
      <path d="M28 14v4" stroke={FG} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export const serviceIcons3D = [ServiceSwiftIcon, ServiceExchangeIcon, ServiceCryptoFiatIcon, ServiceConsultIcon] as const;
