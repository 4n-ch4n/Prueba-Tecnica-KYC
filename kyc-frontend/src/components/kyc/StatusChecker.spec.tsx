import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import StatusChecker from './StatusChecker';
import { useGetVerification } from '../../hooks/useVerification';
import { useKycStore } from '../../store/useKycStore';

// Mockear custom hooks y store
vi.mock('../../hooks/useVerification', () => ({
  useGetVerification: vi.fn(),
}));

vi.mock('../../store/useKycStore', () => ({
  useKycStore: vi.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('Componente StatusChecker', () => {
  let mockSetCurrentView: any;

  beforeEach(() => {
    mockSetCurrentView = vi.fn();
    (useKycStore as any).mockReturnValue({
      setCurrentView: mockSetCurrentView,
      submittedVerificationId: '',
    });

    (useGetVerification as any).mockReturnValue({
      data: null,
      error: null,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <StatusChecker />
      </QueryClientProvider>
    );
  };

  it('debería renderizar la barra de búsqueda inicial', () => {
    renderComponent();
    expect(screen.getByText('Consultar Estado')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ingresa tu UUID/i)).toBeInTheDocument();
  });

  it('debería mostrar mensaje de carga si está buscando', () => {
    (useGetVerification as any).mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    });

    renderComponent();
    expect(screen.getByText('Consultando registros en el Edge...')).toBeInTheDocument();
  });

  it('debería mostrar mensaje de error si la búsqueda falla', () => {
    (useGetVerification as any).mockReturnValue({
      data: null,
      error: new Error('La verificación no existe'),
      isLoading: false,
      isError: true,
      refetch: vi.fn(),
    });

    renderComponent();
    expect(screen.getByText('La verificación no existe')).toBeInTheDocument();
  });

  it('debería mostrar la información de la verificación si la encuentra', () => {
    const mockData = {
      success: true,
      data: {
        id: 'e041ec11-abe6-4161-9be7-f7c954042899',
        name: 'Juan Pérez',
        email: 'juan@test.com',
        documentNumber: '12345678',
        status: 'approved' as const,
        selfieUrl: 'https://storage.local/selfie.jpg',
        documentUrl: 'https://storage.local/doc.jpg',
      },
    };

    (useGetVerification as any).mockReturnValue({
      data: mockData,
      error: null,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderComponent();

    expect(screen.getByText('Aprobado')).toBeInTheDocument();
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('juan@test.com')).toBeInTheDocument();
  });

  it('debería ejecutar la búsqueda cuando se envía el formulario con UUID válido', async () => {
    const mockRefetch = vi.fn();
    (useGetVerification as any).mockReturnValue({
      data: null,
      error: null,
      isLoading: false,
      isError: false,
      refetch: mockRefetch,
    });

    renderComponent();

    const input = screen.getByPlaceholderText(/Ingresa tu UUID/i);
    fireEvent.change(input, { target: { value: 'e041ec11-abe6-4161-9be7-f7c954042899' } });

    const searchBtn = screen.getByRole('button', { name: /buscar/i });
    fireEvent.click(searchBtn);

    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  it('debería mostrar mensaje de validación si el ID está vacío o no es UUID', () => {
    renderComponent();

    const searchBtn = screen.getByRole('button', { name: /buscar/i });
    
    // Dejar vacío y buscar
    fireEvent.click(searchBtn);
    expect(screen.getByText('Por favor ingresa un ID de verificación')).toBeInTheDocument();

    // ID inválido
    const input = screen.getByPlaceholderText(/Ingresa tu UUID/i);
    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.click(searchBtn);
    expect(screen.getByText('Formato de ID inválido. Debe ser un UUID v4 válido')).toBeInTheDocument();
  });

  it('debería mostrar la insignia de rechazado', () => {
    const mockData = {
      success: true,
      data: {
        id: 'e041ec11-abe6-4161-9be7-f7c954042899',
        name: 'Juan Pérez',
        email: 'juan@test.com',
        documentNumber: '12345678',
        status: 'rejected' as const,
      },
    };

    (useGetVerification as any).mockReturnValue({
      data: mockData,
      error: null,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderComponent();
    expect(screen.getByText('Rechazado')).toBeInTheDocument();
  });
});
