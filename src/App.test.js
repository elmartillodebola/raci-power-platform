import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('muestra el título Matriz RACI', () => {
  render(<App />);
  expect(screen.getByText('Matriz RACI')).toBeInTheDocument();
});

test('muestra el subtítulo del sector financiero', () => {
  render(<App />);
  expect(screen.getByText(/Sector financiero/i)).toBeInTheDocument();
});

test('muestra los botones de navegación General y Detallada', () => {
  render(<App />);
  expect(screen.getByText('Matriz RACI General')).toBeInTheDocument();
  expect(screen.getByText('Matriz RACI Detallada')).toBeInTheDocument();
});

test('carga la vista General por defecto', () => {
  render(<App />);
  // En vista General aparece "Matriz RACI General v1.0"
  expect(screen.getByText(/Matriz General v1\.0/i)).toBeInTheDocument();
});

test('cambia a la vista Detallada al hacer clic', () => {
  render(<App />);
  fireEvent.click(screen.getByText('Matriz RACI Detallada'));
  expect(screen.getByText(/Matriz Detallada v1\.0/i)).toBeInTheDocument();
});

test('regresa a la vista General desde Detallada', () => {
  render(<App />);
  fireEvent.click(screen.getByText('Matriz RACI Detallada'));
  fireEvent.click(screen.getByText('Matriz RACI General'));
  expect(screen.getByText(/Matriz General v1\.0/i)).toBeInTheDocument();
});
