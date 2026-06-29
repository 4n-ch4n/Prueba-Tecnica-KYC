import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    return (
      <div className="flex flex-col space-y-2 w-full">
        <label 
          htmlFor={inputId}
          className="text-sm font-semibold text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
        <div className="relative flex items-center w-full">
          {icon && (
            <div className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50 transition-all duration-200 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 dark:focus:ring-primary-500/20
              ${icon ? 'pl-12' : ''} 
              ${error ? 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 dark:border-slate-800'} 
              ${className}`}
            {...props}
          />
        </div>
        {error && (
          <span className="text-xs font-semibold text-red-500 dark:text-red-400 mt-0.5 animate-fade-in">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
