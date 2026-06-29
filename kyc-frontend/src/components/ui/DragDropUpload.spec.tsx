import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DragDropUpload from './DragDropUpload';

describe('Componente DragDropUpload', () => {
  const defaultProps = {
    label: 'Sube tu Selfie',
    description: 'Formatos PNG, JPG de máx. 5MB',
    value: null,
    onChange: vi.fn(),
  };

  it('debería renderizar la etiqueta y descripción', () => {
    render(<DragDropUpload {...defaultProps} />);
    expect(screen.getByText('Sube tu Selfie')).toBeInTheDocument();
    expect(screen.getByText('Formatos PNG, JPG de máx. 5MB')).toBeInTheDocument();
  });

  it('debería ser enfocable por teclado y tener rol de botón', () => {
    render(<DragDropUpload {...defaultProps} />);
    const uploadArea = screen.getByRole('button', { name: /sube tu selfie/i });
    expect(uploadArea).toBeInTheDocument();
    expect(uploadArea).toHaveAttribute('tabIndex', '0');
  });

  it('debería renderizar la imagen de vista previa si se proporciona un archivo', () => {
    const file = new File(['dummy_content'], 'avatar.jpg', { type: 'image/jpeg' });
    
    // Simular URL.createObjectURL para jsdom
    global.URL.createObjectURL = vi.fn().mockReturnValue('mock-object-url');
    global.URL.revokeObjectURL = vi.fn();

    render(<DragDropUpload {...defaultProps} value={file} />);

    const img = screen.getByAltText('Vista previa');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'mock-object-url');
    expect(screen.getByText('avatar.jpg')).toBeInTheDocument();
  });

  it('debería activar el cambio de archivo al arrastrar y soltar', () => {
    render(<DragDropUpload {...defaultProps} />);
    const uploadArea = screen.getByRole('button', { name: /sube tu selfie/i });

    const file = new File(['dummy_content'], 'selfie.png', { type: 'image/png' });
    
    fireEvent.drop(uploadArea, {
      dataTransfer: {
        files: [file],
      },
    });

    expect(defaultProps.onChange).toHaveBeenCalledWith(file);
  });

  it('debería disparar click cuando se presiona la tecla Enter o Espacio', () => {
    const { container } = render(<DragDropUpload {...defaultProps} />);
    const uploadArea = screen.getByRole('button', { name: /sube tu selfie/i });

    const input = container.querySelector('input')!;
    const clickSpy = vi.spyOn(input, 'click');

    fireEvent.keyDown(uploadArea, { key: 'Enter' });
    expect(clickSpy).toHaveBeenCalled();

    fireEvent.keyDown(uploadArea, { key: ' ' });
    expect(clickSpy).toHaveBeenCalled();
  });

  it('debería eliminar el archivo cuando se presiona el botón eliminar', () => {
    const file = new File(['dummy_content'], 'avatar.jpg', { type: 'image/jpeg' });
    global.URL.createObjectURL = vi.fn().mockReturnValue('mock-object-url');

    render(<DragDropUpload {...defaultProps} value={file} />);

    const removeBtn = screen.getByTitle('Eliminar archivo');
    fireEvent.click(removeBtn);

    expect(defaultProps.onChange).toHaveBeenCalledWith(null);
  });
});
