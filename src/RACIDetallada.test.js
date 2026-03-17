import { render, screen, fireEvent } from '@testing-library/react';
import RACIMatrixDetallada from './RACIDetallada';

test('renderiza la tabla sin errores', () => {
  render(<RACIMatrixDetallada />);
  expect(screen.getByRole('table')).toBeInTheDocument();
});

test('muestra las columnas de encabezado principales', () => {
  render(<RACIMatrixDetallada />);
  expect(screen.getByText('Componente PP')).toBeInTheDocument();
  expect(screen.getByText('Sub-área / Módulo')).toBeInTheDocument();
  expect(screen.getByText('Actividad')).toBeInTheDocument();
});

test('muestra los ítems de la leyenda RACI', () => {
  render(<RACIMatrixDetallada />);
  expect(screen.getByText('Responsible – Ejecuta')).toBeInTheDocument();
  expect(screen.getByText('Accountable – Rinde cuentas')).toBeInTheDocument();
  expect(screen.getByText('Consulted – Aporta criterio')).toBeInTheDocument();
  expect(screen.getByText('Informed – Debe ser notificado')).toBeInTheDocument();
});

test('muestra el filtro de categorías con opción "Todas"', () => {
  render(<RACIMatrixDetallada />);
  expect(screen.getByRole('combobox')).toBeInTheDocument();
  expect(screen.getByText('Todas')).toBeInTheDocument();
});

test('filtra actividades al seleccionar una categoría', () => {
  render(<RACIMatrixDetallada />);
  const select = screen.getByRole('combobox');
  fireEvent.change(select, { target: { value: 'Copilot Studio' } });
  expect(select.value).toBe('Copilot Studio');
});

test('muestra el botón de exportar Excel', () => {
  render(<RACIMatrixDetallada />);
  expect(screen.getByText(/Exportar Excel/i)).toBeInTheDocument();
});

test('muestra áreas de TI en el encabezado de la tabla', () => {
  render(<RACIMatrixDetallada />);
  expect(screen.getByText('Dev SW')).toBeInTheDocument();
  expect(screen.getByText('CiberSec')).toBeInTheDocument();
});

test('contiene actividades detalladas de Copilot Studio', () => {
  render(<RACIMatrixDetallada />);
  expect(screen.getByText(/Desarrollar agentes y bots con Copilot Studio/i)).toBeInTheDocument();
});

test('contiene actividades de ALM & DevSecOps', () => {
  render(<RACIMatrixDetallada />);
  expect(screen.getByText(/Configurar pipelines CI\/CD/i)).toBeInTheDocument();
});
