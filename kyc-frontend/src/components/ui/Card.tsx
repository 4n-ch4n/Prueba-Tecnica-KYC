import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/50 rounded-2xl shadow-xl shadow-slate-200/40 dark:shadow-none p-6 md:p-8 animate-slide-up ${className}`}>
      {children}
    </div>
  );
};
export default Card;
