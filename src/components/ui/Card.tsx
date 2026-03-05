import React from 'react';
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  noPadding?: boolean;
}
export function Card({
  children,
  className = '',
  hoverEffect = false,
  noPadding = false,
  ...props
}: CardProps) {
  return (
    <div
      className={`
        bg-[var(--bg-secondary)] 
        border border-[var(--border-color)] 
        rounded-xl 
        overflow-hidden
        ${hoverEffect ? 'transition-all duration-300 hover:-translate-y-1 hover:border-[#B6FF2E]/30 hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)]' : ''}
        ${noPadding ? '' : 'p-6'}
        ${className}
      `}
      {...props}>

      {children}
    </div>);

}