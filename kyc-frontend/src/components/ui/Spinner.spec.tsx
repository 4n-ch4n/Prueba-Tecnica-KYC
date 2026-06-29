import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Spinner from './Spinner';

describe('Componente Spinner', () => {
  it('debería renderizar correctamente sin fallar', () => {
    const { container } = render(<Spinner size="md" />);
    const spinner = container.querySelector('div');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');
  });

  it('debería soportar diferentes tamaños', () => {
    const { container, rerender } = render(<Spinner size="sm" />);
    expect(container.querySelector('div')).toHaveClass('w-4');

    rerender(<Spinner size="lg" />);
    expect(container.querySelector('div')).toHaveClass('w-12');
  });
});
