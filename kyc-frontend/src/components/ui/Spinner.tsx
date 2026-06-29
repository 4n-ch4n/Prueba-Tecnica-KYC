import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div
      className={`animate-spin rounded-full border-slate-300 dark:border-slate-700 border-t-primary-500 dark:border-t-primary-400 ${sizeClasses[size]} ${className}`}
      role="status"
    />
  );
};
export default Spinner;
