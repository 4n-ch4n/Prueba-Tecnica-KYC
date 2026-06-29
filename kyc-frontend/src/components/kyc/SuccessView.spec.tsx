import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SuccessView from './SuccessView';
import { useKycStore } from '../../store/useKycStore';

// Mockear useKycStore
vi.mock('../../store/useKycStore', () => ({
  useKycStore: vi.fn(),
}));

describe('Componente SuccessView', () => {
  let mockSetCurrentView: any;
  let mockSetSubmittedVerificationId: any;

  beforeEach(() => {
    mockSetCurrentView = vi.fn();
    mockSetSubmittedVerificationId = vi.fn();
    
    (useKycStore as any).mockReturnValue({
      submittedVerificationId: 'e041ec11-abe6-4161-9be7-f7c954042899',
      setCurrentView: mockSetCurrentView,
      setSubmittedVerificationId: mockSetSubmittedVerificationId,
    });

    // Mock de clipboard usando Object.defineProperty para evitar el error de asignación de sólo lectura en TS
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      configurable: true,
      writable: true,
    });
  });

  it('debería mostrar el ID de verificación y el título de éxito', () => {
    render(<SuccessView />);
    expect(screen.getByText('¡Solicitud Recibida Exitosamente!')).toBeInTheDocument();
    expect(screen.getByText('e041ec11-abe6-4161-9be7-f7c954042899')).toBeInTheDocument();
  });

  it('debería copiar el ID al portapapeles cuando se pulsa el botón de copiar', async () => {
    render(<SuccessView />);
    const copyBtn = screen.getByTitle('Copiar ID');
    fireEvent.click(copyBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('e041ec11-abe6-4161-9be7-f7c954042899');
    expect(await screen.findByText('¡ID copiado al portapapeles!')).toBeInTheDocument();
  });

  it('debería cambiar la vista a "checking" cuando se pulsa consultar estado', () => {
    render(<SuccessView />);
    const checkBtn = screen.getByRole('button', { name: /consultar estado ahora/i });
    fireEvent.click(checkBtn);
    expect(mockSetCurrentView).toHaveBeenCalledWith('checking');
  });

  it('debería reiniciar la ID de verificación y volver a "form" al pedir un nuevo registro', () => {
    render(<SuccessView />);
    const newBtn = screen.getByRole('button', { name: /nueva verificación/i });
    fireEvent.click(newBtn);
    expect(mockSetSubmittedVerificationId).toHaveBeenCalledWith(null);
    expect(mockSetCurrentView).toHaveBeenCalledWith('form');
  });
});
