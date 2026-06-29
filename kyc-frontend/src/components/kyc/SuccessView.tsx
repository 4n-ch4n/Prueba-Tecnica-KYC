import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, ArrowRight, RefreshCw } from 'lucide-react';
import { useKycStore } from '../../store/useKycStore';
import Button from '../ui/Button';

export const SuccessView: React.FC = () => {
  const { submittedVerificationId, setCurrentView, setSubmittedVerificationId } = useKycStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (submittedVerificationId) {
      try {
        await navigator.clipboard.writeText(submittedVerificationId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Fallo al copiar el ID de verificación: ', err);
      }
    }
  };

  const handleNewRegister = () => {
    setSubmittedVerificationId(null);
    setCurrentView('form');
  };

  return (
    <div className="text-center space-y-6 py-4 animate-fade-in">
      <div className="flex justify-center">
        <div className="p-4 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 rounded-full border border-green-100 dark:border-green-800/30">
          <CheckCircle2 className="w-16 h-16 animate-bounce" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          ¡Solicitud Recibida Exitosamente!
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Tus datos y documentos han sido enviados y se encuentran en proceso de validación. Guarda tu ID de verificación para consultar el estado.
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 max-w-md mx-auto">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Tu ID de Verificación
        </p>
        <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800">
          <span className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300 truncate select-all">
            {submittedVerificationId}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex-shrink-0 text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            title="Copiar ID"
          >
            {copied ? (
              <Check className="w-4.5 h-4.5 text-green-500" />
            ) : (
              <Copy className="w-4.5 h-4.5" />
            )}
          </button>
        </div>
        {copied && (
          <p className="text-xs font-bold text-green-600 dark:text-green-400 mt-1.5 animate-fade-in">
            ¡ID copiado al portapapeles!
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-4">
        <Button
          variant="primary"
          onClick={() => setCurrentView('checking')}
          className="w-full justify-center"
        >
          Consultar Estado Ahora
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <Button
          variant="secondary"
          onClick={handleNewRegister}
          className="w-full justify-center"
        >
          Nueva Verificación
          <RefreshCw className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
export default SuccessView;
