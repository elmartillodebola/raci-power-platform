import { render, screen, fireEvent } from '@testing-library/react';
import RACIMatrixDetallada from './RACIDetallada';

test('renderiza la tabla sin errores', () => {
  render(<RACIMatrixDetallada />);
  expect(screen.getByRole('table')).toBeInTheDocument();
});

test('muestra las columnas de encabezado principales', () => {
  render(<RACIMatrixDetallada />);
  expect(screen.getAllByText('Componente PP').length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByText('Sub-área / Módulo').length).toBeGreaterThanOrEqual(1);
  expect(screen.getByText('Actividad')).toBeInTheDocument();
});

test('muestra los ítems de la leyenda RACI incluyendo No aplica', () => {
  render(<RACIMatrixDetallada />);
  expect(screen.getByText('Responsible – Ejecuta')).toBeInTheDocument();
  expect(screen.getByText('Accountable – Rinde cuentas')).toBeInTheDocument();
  expect(screen.getByText('Consulted – Aporta criterio')).toBeInTheDocument();
  expect(screen.getByText('Informed – Debe ser notificado')).toBeInTheDocument();
  expect(screen.getByText('No aplica')).toBeInTheDocument();
});

test('muestra dos filtros con opción "Todas"', () => {
  render(<RACIMatrixDetallada />);
  const selects = screen.getAllByRole('combobox');
  expect(selects).toHaveLength(2);
  expect(screen.getAllByText('Todas').length).toBeGreaterThanOrEqual(2);
});

test('muestra etiquetas de los filtros', () => {
  render(<RACIMatrixDetallada />);
  expect(screen.getAllByText('Componente PP').length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByText('Sub-área / Módulo').length).toBeGreaterThanOrEqual(1);
});

test('filtra actividades al seleccionar una categoría', () => {
  render(<RACIMatrixDetallada />);
  const [selectCat] = screen.getAllByRole('combobox');
  fireEvent.change(selectCat, { target: { value: 'Copilot Studio' } });
  expect(selectCat.value).toBe('Copilot Studio');
});

test('resetea el filtro de sub-área al cambiar el componente PP', () => {
  render(<RACIMatrixDetallada />);
  const [selectCat, selectComp] = screen.getAllByRole('combobox');
  fireEvent.change(selectCat, { target: { value: 'Power Apps' } });
  expect(selectComp.value).toBe('Todas');
});

test('muestra el botón de exportar Excel', () => {
  render(<RACIMatrixDetallada />);
  expect(screen.getByText(/Exportar Excel/i)).toBeInTheDocument();
});

test('muestra el botón de edición', () => {
  render(<RACIMatrixDetallada />);
  expect(screen.getByText(/Editar valores/i)).toBeInTheDocument();
});

test('activa el modo edición al hacer clic en Editar valores', () => {
  render(<RACIMatrixDetallada />);
  fireEvent.click(screen.getByText(/Editar valores/i));
  expect(screen.getByText(/Modo edición activo/i)).toBeInTheDocument();
  expect(screen.getByText(/Guardar y descargar JSON/i)).toBeInTheDocument();
  expect(screen.getByText('Cancelar')).toBeInTheDocument();
});

test('cancela el modo edición sin guardar', () => {
  render(<RACIMatrixDetallada />);
  fireEvent.click(screen.getByText(/Editar valores/i));
  fireEvent.click(screen.getByText('Cancelar'));
  expect(screen.queryByText(/Modo edición activo/i)).not.toBeInTheDocument();
  expect(screen.getByText(/Editar valores/i)).toBeInTheDocument();
});

test('muestra áreas de TI actualizadas en el encabezado', () => {
  render(<RACIMatrixDetallada />);
  expect(screen.getAllByText('CIS').length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByText('CiberSec').length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByText('COE-TI Arq').length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByText('COE-TI Ops').length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByText('COE-TI Mesa').length).toBeGreaterThanOrEqual(1);
});

test('contiene actividades detalladas de Copilot Studio', () => {
  render(<RACIMatrixDetallada />);
  expect(screen.getByText(/Desarrollar agentes y bots con Copilot Studio/i)).toBeInTheDocument();
});

test('contiene actividades de ALM & DevSecOps', () => {
  render(<RACIMatrixDetallada />);
  expect(screen.getByText(/Configurar pipelines CI\/CD/i)).toBeInTheDocument();
});

test('contiene la nueva actividad de gobierno de SharePoint', () => {
  render(<RACIMatrixDetallada />);
  expect(screen.getByText(/gobierno de datos de SharePoint/i)).toBeInTheDocument();
});

test('contiene la nueva actividad de acuerdos RPA y Power Automate', () => {
  render(<RACIMatrixDetallada />);
  expect(screen.getByText(/acuerdos de cobertura entre Power Automate/i)).toBeInTheDocument();
});
