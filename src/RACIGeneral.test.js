import { render, screen, fireEvent } from '@testing-library/react';
import RACIMatrixGeneral from './RACIGeneral';

test('renderiza la tabla sin errores', () => {
  render(<RACIMatrixGeneral />);
  expect(screen.getByRole('table')).toBeInTheDocument();
});

test('muestra las columnas de encabezado principales', () => {
  render(<RACIMatrixGeneral />);
  expect(screen.getByText('Componente PP')).toBeInTheDocument();
  expect(screen.getByText('Alcance / Módulo')).toBeInTheDocument();
  expect(screen.getByText('Actividad')).toBeInTheDocument();
});

test('muestra los ítems de la leyenda RACI', () => {
  render(<RACIMatrixGeneral />);
  expect(screen.getByText(/Responsible/i)).toBeInTheDocument();
  expect(screen.getByText(/Accountable/i)).toBeInTheDocument();
  expect(screen.getByText(/Consulted/i)).toBeInTheDocument();
  expect(screen.getByText(/Informed/i)).toBeInTheDocument();
});

test('muestra el filtro de categorías con opción "Todas"', () => {
  render(<RACIMatrixGeneral />);
  expect(screen.getByRole('combobox')).toBeInTheDocument();
  expect(screen.getByText('Todas')).toBeInTheDocument();
});

test('filtra actividades al seleccionar una categoría', () => {
  render(<RACIMatrixGeneral />);
  const select = screen.getByRole('combobox');
  fireEvent.change(select, { target: { value: 'Power BI' } });
  expect(select.value).toBe('Power BI');
});

test('muestra el botón de exportar Excel', () => {
  render(<RACIMatrixGeneral />);
  expect(screen.getByText(/Exportar Excel/i)).toBeInTheDocument();
});

test('muestra áreas de TI en el encabezado de la tabla', () => {
  render(<RACIMatrixGeneral />);
  expect(screen.getByText('Dev SW')).toBeInTheDocument();
  expect(screen.getByText('CiberSec')).toBeInTheDocument();
});

test('contiene actividades de la categoría Power Platform Admin & CoE', () => {
  render(<RACIMatrixGeneral />);
  expect(screen.getByText(/Definición de modelo de gobierno/i)).toBeInTheDocument();
});
