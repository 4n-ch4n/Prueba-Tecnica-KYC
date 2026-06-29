import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface KycState {
  darkMode: boolean;
  currentView: 'form' | 'success' | 'checking';
  submittedVerificationId: string | null;
  toggleDarkMode: () => void;
  setCurrentView: (view: 'form' | 'success' | 'checking') => void;
  setSubmittedVerificationId: (id: string | null) => void;
}

export const useKycStore = create<KycState>()(
  persist(
    (set) => ({
      darkMode: false,
      currentView: 'form',
      submittedVerificationId: null,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setCurrentView: (view) => set({ currentView: view }),
      setSubmittedVerificationId: (id) => set({ submittedVerificationId: id }),
    }),
    {
      name: 'kyc-platform-store',
      // Persistimos tanto el modo oscuro como la última ID de verificación sometida para conveniencia del usuario
      partialize: (state) => ({
        darkMode: state.darkMode,
        submittedVerificationId: state.submittedVerificationId,
      }),
    }
  )
);
