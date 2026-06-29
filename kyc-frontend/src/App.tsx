import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ShieldAlert, Sun, Moon, Search, FileText } from 'lucide-react';
import { useKycStore } from './store/useKycStore';
import Card from './components/ui/Card';
import VerificationForm from './components/kyc/VerificationForm';
import SuccessView from './components/kyc/SuccessView';
import StatusChecker from './components/kyc/StatusChecker';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export const App: React.FC = () => {
  const { darkMode, toggleDarkMode, currentView, setCurrentView } = useKycStore();

  // Sincronizar el estado del modo oscuro con la etiqueta html raíz para Tailwind v4
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const renderView = () => {
    switch (currentView) {
      case 'form':
        return <VerificationForm />;
      case 'success':
        return <SuccessView />;
      case 'checking':
        return <StatusChecker />;
      default:
        return <VerificationForm />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        
        {/* Header Superior */}
        <header className="border-b border-slate-200/60 dark:border-slate-900 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md sticky top-0 z-30">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <div 
              onClick={() => setCurrentView('form')}
              className="flex items-center space-x-2.5 cursor-pointer select-none group"
            >
              <div className="p-2 bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-xl group-hover:scale-105 transition-transform duration-200">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-base md:text-lg tracking-tight bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">
                KYC Edge Platform
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentView(currentView === 'checking' ? 'form' : 'checking')}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
              >
                {currentView === 'checking' ? (
                  <>
                    <FileText className="w-4 h-4 text-primary-500" />
                    <span>Verificar</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 text-primary-500" />
                    <span>Estado</span>
                  </>
                )}
              </button>

              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-200 active:scale-95"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>

        {/* Contenido Principal */}
        <main className="max-w-4xl mx-auto px-4 py-8 md:py-16">
          <Card className="w-full">
            {renderView()}
          </Card>
        </main>

        {/* Footer */}
        <footer className="max-w-4xl mx-auto px-4 py-6 text-center border-t border-slate-200/40 dark:border-slate-900/60">
          <p className="text-xs font-bold text-slate-400">
            © {new Date().getFullYear()} KYC Edge Platform. Desarrollado en Cloudflare Pages & Workers.
          </p>
        </footer>

      </div>
    </QueryClientProvider>
  );
};
export default App;
