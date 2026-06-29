import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Alert from './Alert';

describe('Componente Alert', () => {
  it('debería renderizar el mensaje y el título', () => {
    render(<Alert type="success" title="Completado" message="La operación fue un éxito" />);
    expect(screen.getByText('Completado')).toBeInTheDocument();
    expect(screen.getByText('La operación fue un éxito')).toBeInTheDocument();
  });

  it('debería soportar diferentes tipos', () => {
    const { rerender } = render(<Alert type="error" message="Fallo grave" />);
    expect(screen.getByText('Fallo grave')).toBeInTheDocument();

    rerender(<Alert type="warning" message="Advertencia" />);
    expect(screen.getByText('Advertencia')).toBeInTheDocument();
  });
});
