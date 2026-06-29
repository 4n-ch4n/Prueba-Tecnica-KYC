import React, { useState } from 'react';
import { Search, ArrowLeft, CheckCircle2, AlertCircle, Clock, Image as ImageIcon } from 'lucide-react';
import { useKycStore } from '../../store/useKycStore';
import { useGetVerification } from '../../hooks/useVerification';
import type { Verification } from '../../types';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import Spinner from '../ui/Spinner';

export const StatusChecker: React.FC = () => {
  const { setCurrentView, submittedVerificationId } = useKycStore();
  const [searchId, setSearchId] = useState(submittedVerificationId || '');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [triggerQuery, setTriggerQuery] = useState(!!submittedVerificationId);

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  const { data, error, isLoading, isError, refetch } = useGetVerification(searchId, triggerQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setTriggerQuery(false);

    const cleanId = searchId.trim();
    if (!cleanId) {
      setValidationError('Por favor ingresa un ID de verificación');
      return;
    }

    if (!uuidRegex.test(cleanId)) {
      setValidationError('Formato de ID inválido. Debe ser un UUID v4 válido');
      return;
    }

    setTriggerQuery(true);
    // Ejecutar refetch si la query ya fue instanciada antes con el mismo ID
    setTimeout(() => refetch(), 0);
  };

  const getStatusBadge = (status?: Verification['status']) => {
    const badges = {
      approved: {
        bg: 'bg-green-100 dark:bg-green-950/30 border-green-200 dark:border-green-800/30 text-green-700 dark:text-green-300',
        icon: <CheckCircle2 className="w-5 h-5" />,
        text: 'Aprobado',
      },
      rejected: {
        bg: 'bg-red-100 dark:bg-red-950/30 border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-300',
        icon: <AlertCircle className="w-5 h-5" />,
        text: 'Rechazado',
      },
      pending: {
        bg: 'bg-amber-100 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/30 text-amber-700 dark:text-amber-300',
        icon: <Clock className="w-5 h-5 animate-pulse" />,
        text: 'Pendiente de Revisión',
      },
    };

    if (!status || !badges[status]) {
      return null;
    }

    const { bg, icon, text } = badges[status];

    return (
      <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl border font-bold text-sm ${bg}`}>
        {icon}
        <span>{text}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('form')}
          className="flex items-center space-x-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Registro</span>
        </button>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
          Consultar Estado
        </h2>
      </div>

      <form onSubmit={handleSearchSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-end">
          <div className="flex-1 w-full">
            <Input
              label="ID de Verificación"
              placeholder="Ingresa tu UUID (ej: e041ec11-...)"
              icon={<Search className="w-5 h-5" />}
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              error={validationError || undefined}
            />
          </div>
          <Button type="submit" className="w-full md:w-auto md:h-[48px] justify-center">
            Buscar
          </Button>
        </div>
      </form>

      {isLoading && (
        <div className="py-12 flex flex-col items-center justify-center space-y-3">
          <Spinner size="lg" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Consultando registros en el Edge...
          </p>
        </div>
      )}

      {isError && (
        <Alert
          type="error"
          title="Error en la Consulta"
          message={error?.message || 'Ocurrió un error inesperado al conectar con el servidor.'}
        />
      )}

      {data && data.success && data.data && (
        <div className="border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 md:p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/20 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                ID de Registro
              </p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 font-mono select-all">
                {data.data.id}
              </p>
            </div>
            <div>{getStatusBadge(data.data.status)}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Nombre Completo
              </p>
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                {data.data.name}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Correo Electrónico
              </p>
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                {data.data.email}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Número de Documento
              </p>
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                {data.data.documentNumber}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {data.data.selfieUrl && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Selfie Cargada
                </p>
                <div className="aspect-video relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 group">
                  <img
                    src={data.data.selfieUrl}
                    alt="Selfie"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>
            )}

            {data.data.documentUrl && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Documento Cargado
                </p>
                <div className="aspect-video relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 group">
                  <img
                    src={data.data.documentUrl}
                    alt="Documento"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default StatusChecker;
