// src/utils/exportExcel.js
import * as XLSX from 'xlsx';

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function calcularHoras(fechaStr) {
  const fecha = new Date(fechaStr);
  const verano = fecha >= new Date('2025-06-15') && fecha <= new Date('2025-09-15');
  return verano ? 6.5 : 8;
}

export function generarExcelDesdeBD(usuario, vacaciones) {
  const rows = vacaciones.map((v) => {
    const desde = formatearFecha(v.fecha_inicio);
    const hasta = formatearFecha(v.fecha_fin);
    const esFichaje = v.estado === 'Fichado manual';
    const horas = esFichaje ? calcularHoras(v.fecha_inicio) : '';
    return {
      Nombre: esFichaje ? '(Fichajes)' : '(Vacaciones)',
      Desde: desde,
      Hasta: hasta,
      Estado: esFichaje ? `${horas} horas` : 'Solicitada',
      Comentario: v.comentario_admin || 'Sin comentarios',
    };
  });

  const totalVacaciones = vacaciones.filter(v => v.estado === 'Solicitada').length;
  const totalHoras = vacaciones
    .filter(v => v.estado === 'Fichado manual')
    .reduce((acc, v) => acc + calcularHoras(v.fecha_inicio), 0);

  // Agrega filas de resumen
  rows.push({});
  rows.push({ Nombre: 'Total horas trabajadas:', Desde: totalHoras });
  rows.push({ Nombre: 'Total días de vacaciones:', Desde: totalVacaciones });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Resumen');

  XLSX.writeFile(workbook, `${usuario.nombre}_resumen_horas_vacaciones.xlsx`);
}
