import { render, screen } from '@testing-library/react';
import App from './App';

test('muestra el título Matriz RACI', () => {
  render(<App />);
  expect(screen.getByText('Matriz RACI')).toBeInTheDocument();
});

test('muestra el subtítulo del sector financiero', () => {
  render(<App />);
  expect(screen.getAllByText(/Sector financiero/i).length).toBeGreaterThanOrEqual(1);
});

test('muestra directamente la matriz detallada sin toggle de vistas', () => {
  render(<App />);
  expect(screen.getByRole('table')).toBeInTheDocument();
  expect(screen.queryByText('Matriz RACI General')).not.toBeInTheDocument();
  expect(screen.queryByText('Matriz RACI Detallada')).not.toBeInTheDocument();
});
