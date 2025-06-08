import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/FichaUsuario.css';
import { generarExcelDesdeBD } from '../utils/exportExcel';

const FichaUsuario = () => {
  const { id } = useParams();
  const [vacacionesDB, setVacacionesDB] = useState([]);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [vacaciones, setVacaciones] = useState({}); // fechas seleccionadas como vacaciones
  const [fichajes, setFichajes] = useState({});     // fechas seleccionadas como fichajes

  const festivos = [
    '2025-01-01','2025-01-06','2025-04-17','2025-04-18','2025-05-01',
    '2025-05-02','2025-05-15','2025-07-25','2025-08-15','2025-11-01',
    '2025-11-10','2025-12-06','2025-12-08','2025-12-25'
  ];
  const INICIO_VERANO = new Date('2025-06-15');
  const FIN_VERANO = new Date('2025-09-15');
  const esVerano = (fecha) => fecha >= INICIO_VERANO && fecha <= FIN_VERANO;

  useEffect(() => {
    const fetchVacaciones = async () => {
      try {
        const res = await fetch(`/vacaciones/usuario/${id}`);
        const data = await res.json();
        setVacacionesDB(data.vacaciones || []);
        setNombre(data.nombre || 'Usuario');
        setEmail(data.email || '');

        // Mapear días
        const vac = {}, fich = {};
        data.vacaciones.forEach(v => {
          const inicio = new Date(v.fecha_inicio);
          const fin = new Date(v.fecha_fin);
          for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
            const key = new Date(d).toISOString().split('T')[0];
            if (v.estado === 'Solicitada') vac[key] = true;
            if (v.estado === 'Fichado manual') fich[key] = true;
          }
        });
        setVacaciones(vac);
        setFichajes(fich);
      } catch (error) {
        console.error('Error al obtener vacaciones:', error);
      }
    };
    fetchVacaciones();
  }, [id]);

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(''), 3000);
  };

  const manejarSeleccion = (fecha, tipo) => {
    const key = fecha.toISOString().split('T')[0];

    if (tipo === 'Solicitada') {
      if (fichajes[key]) return mostrarMensaje('Ese día ya está fichado.');
      setVacaciones(prev => ({ ...prev, [key]: !prev[key] }));
    }

    if (tipo === 'Fichado manual') {
      if (vacaciones[key]) return mostrarMensaje('Ese día ya está marcado como vacaciones.');
      setFichajes(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const tileClassNameVacaciones = ({ date }) => {
    const iso = date.toISOString().split('T')[0];
    if (vacaciones[iso]) return 'seleccionado-vacaciones';
    if (festivos.includes(iso)) return 'rojo';
    if ([0, 6].includes(date.getDay())) return 'gris';
    return null;
  };

  const tileClassNameFichajes = ({ date }) => {
    const iso = date.toISOString().split('T')[0];
    if (fichajes[iso]) return 'seleccionado-fichajes';
    if (festivos.includes(iso)) return 'rojo';
    if ([0, 6].includes(date.getDay())) return 'gris';
    return null;
  };

  const totalVacaciones = Object.values(vacaciones).filter(Boolean).length;
  const totalHoras = Object.entries(fichajes).reduce((sum, [fecha, marcado]) => {
    if (!marcado) return sum;
    const fechaObj = new Date(fecha);
    return sum + (esVerano(fechaObj) ? 6.5 : 8);
  }, 0);

  const exportar = () => {
    const registros = [];
    for (const [fecha, activo] of Object.entries(vacaciones)) {
      if (activo) registros.push({ fecha_inicio: fecha, fecha_fin: fecha, estado: 'Solicitada', comentario_admin: '' });
    }
    for (const [fecha, activo] of Object.entries(fichajes)) {
      if (activo) registros.push({ fecha_inicio: fecha, fecha_fin: fecha, estado: 'Fichado manual', comentario_admin: '' });
    }
    generarExcelDesdeBD({ nombre }, registros);
  };

  return (
    <div className="ficha-usuario">
      <div className="ficha-header">
        <h2>{nombre}</h2>
        <p>{email}</p>
      </div>

      {mensaje && <div className="mensaje-emergente">{mensaje}</div>}

      <div className="calendarios-container">
        <div className="calendario-bloque">
          <h3>Calendario de Vacaciones</h3>
          <Calendar
            tileClassName={tileClassNameVacaciones}
            onClickDay={(date) => manejarSeleccion(date, 'Solicitada')}
          />
        </div>

        <div className="calendario-bloque">
          <h3>Calendario de Fichajes</h3>
          <Calendar
            tileClassName={tileClassNameFichajes}
            onClickDay={(date) => manejarSeleccion(date, 'Fichado manual')}
          />
        </div>
      </div>

      <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>
        Días de vacaciones gastados: {totalVacaciones} <br />
        Total horas trabajadas: {totalHoras.toFixed(1)}
      </div>

      <button className="btn-exportar" onClick={exportar}>
        Exportar a Excel
      </button>
    </div>
  );
};

export default FichaUsuario;