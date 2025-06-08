function formatoFechaLocal(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

export function generarDiasDelMes(mesIndex) {
  const dias = [];
  const anio = 2025;

  const primerDiaMes = new Date(anio, mesIndex, 1);
  const ultimoDiaMes = new Date(anio, mesIndex + 1, 0);
  const primerDiaSemana = (primerDiaMes.getDay() + 6) % 7; // lunes = 0

  const festivosNacionales = [
    '2025-01-01', // Año Nuevo
    '2025-01-06', // Reyes
    '2025-04-17', // Jueves Santo
    '2025-04-18', // Viernes Santo
    '2025-05-01', // Día del Trabajador
    '2025-07-25', // Santiago Apóstol
    '2025-08-15', // Asunción
    '2025-11-01', // Todos los Santos
    '2025-11-10', // Traslado Todos los Santos
    '2025-12-06', // Constitución
    '2025-12-25'  // Navidad
  ];

  const festivosMadrid = [
    '2025-05-02', // Comunidad de Madrid
    '2025-12-08', // Inmaculada Concepción
    '2025-05-15'  // San Isidro
  ];

  const esVerano = (fecha) =>
    fecha >= new Date(anio, 5, 15) && fecha <= new Date(anio, 8, 15); // 15 junio - 15 sept

  // Días del mes anterior en gris
  for (let i = 0; i < primerDiaSemana; i++) {
    dias.push({ numero: '', color: 'gris' });
  }

  for (let dia = 1; dia <= ultimoDiaMes.getDate(); dia++) {
    const fecha = new Date(anio, mesIndex, dia);
    const fechaStr = formatoFechaLocal(fecha);
    const diaSemana = fecha.getDay();
    const esFinDeSemana = diaSemana === 0 || diaSemana === 6;
    let color = '';

    if (festivosNacionales.includes(fechaStr)) {
      color = 'naranja';
    } else if (festivosMadrid.includes(fechaStr)) {
      color = 'rojo';
    } else if (esFinDeSemana) {
      color = 'rosa';
    } else if (esVerano(fecha)) {
      color = 'amarillo';
    } else {
      color = 'azul';
    }

    dias.push({ numero: dia, color });
  }

  return dias;
}
