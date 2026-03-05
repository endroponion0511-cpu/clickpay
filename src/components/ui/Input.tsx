import React from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightElement?: React.ReactNode;
}
export function Input({
  label,
  error,
  rightElement,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || Math.random().toString(36).substr(2, 9);
  return (
    <div className="w-full">
      {label &&
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-[var(--text-muted)] mb-2">

          {label}
        </label>
      }
      <div className="relative">
        <input
          id={inputId}
          className={`
            block w-full rounded-lg 
            bg-[var(--bg-primary)] 
            border border-[var(--border-color)] 
            text-[var(--text-primary)] 
            placeholder-[var(--text-muted)]
            focus:border-[#B6FF2E] focus:ring-1 focus:ring-[#B6FF2E] focus:outline-none
            transition-colors
            py-3 px-4 min-h-[44px]
            ${rightElement ? 'pr-12' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props} />

        {rightElement &&
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {rightElement}
          </div>
        }
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>);

}