import React from 'react';
import { Loader2 } from 'lucide-react';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}
export function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
  'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B6FF2E] disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary:
    'bg-[#B6FF2E] text-black hover:bg-[#a2e625] shadow-[0_0_15px_rgba(182,255,46,0.3)] hover:shadow-[0_0_25px_rgba(182,255,46,0.5)] border border-transparent',
    secondary:
    'bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] hover:border-[#B6FF2E]/50 hover:bg-[var(--bg-tertiary)]',
    outline:
    'bg-transparent text-[var(--text-primary)] border border-[var(--border-color)] hover:border-[#B6FF2E] hover:text-[#B6FF2E]',
    ghost:
    'bg-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
  };
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-6 text-base',
    lg: 'h-14 px-8 text-lg'
  };
  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}>

      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>);

}