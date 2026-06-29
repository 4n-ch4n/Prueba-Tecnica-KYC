import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import VerificationForm from './VerificationForm';
import { useCreateVerification } from '../../hooks/useVerification';

// Mock del custom hook
vi.mock('../../hooks/useVerification', () => ({
  useCreateVerification: vi.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('Componente VerificationForm', () => {
  let mockMutate: any;

  beforeEach(() => {
    mockMutate = vi.fn();
    (useCreateVerification as any).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    });

    // Mock URL para jsdom
    globalThis.URL.createObjectURL = vi.fn().mockReturnValue('mock-object-url');
    globalThis.URL.revokeObjectURL = vi.fn();
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <VerificationForm />
      </QueryClientProvider>
    );
  };

  it('debería mostrar errores de validación de Zod si se envía el formulario vacío', async () => {
    renderComponent();

    const submitBtn = screen.getByRole('button', { name: /enviar solicitud/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText('El nombre es obligatorio y debe tener al menos 2 caracteres')).toBeInTheDocument();
    expect(await screen.findByText('Ingresa una dirección de correo válida')).toBeInTheDocument();
    expect(await screen.findByText('El número de documento debe tener al menos 3 caracteres')).toBeInTheDocument();
  });

  it('debería enviar el formulario con datos válidos', async () => {
    const { container } = renderComponent();

    // Llenar campos de texto
    fireEvent.change(screen.getByLabelText(/nombre completo/i), { target: { value: 'Juan Pérez' } });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'juan@test.com' } });
    fireEvent.change(screen.getByLabelText(/número de documento/i), { target: { value: '12345678' } });

    // Subir archivos simulando el evento change en los inputs file
    const selfieFile = new File(['selfie_data'], 'selfie.jpg', { type: 'image/jpeg' });
    const docFile = new File(['doc_data'], 'document.png', { type: 'image/png' });

    const selfieInput = container.querySelector('#upload-foto-de-selfie')!;
    const docInput = container.querySelector('#upload-foto-del-documento')!;

    fireEvent.change(selfieInput, { target: { files: [selfieFile] } });
    fireEvent.change(docInput, { target: { files: [docFile] } });

    const submitBtn = screen.getByRole('button', { name: /enviar solicitud/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledTimes(1);
    });
  });
});
