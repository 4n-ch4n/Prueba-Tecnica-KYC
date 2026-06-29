import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertProps {
  type?: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  className = '',
}) => {
  const styles = {
    success: 'bg-green-50 dark:bg-green-950/10 text-green-800 dark:text-green-300 border-green-200 dark:border-green-900/30',
    error: 'bg-red-50 dark:bg-red-950/10 text-red-800 dark:text-red-300 border-red-200 dark:border-red-900/30',
    info: 'bg-blue-50 dark:bg-blue-950/10 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-900/30',
    warning: 'bg-yellow-50 dark:bg-yellow-950/10 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-900/30',
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
  };

  return (
    <div className={`flex items-start space-x-3 p-4 rounded-xl border ${styles[type]} ${className} animate-fade-in`}>
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1 text-sm font-semibold">
        {title && <h5 className="font-bold mb-0.5">{title}</h5>}
        <p className="leading-relaxed font-normal">{message}</p>
      </div>
    </div>
  );
};
export default Alert;
