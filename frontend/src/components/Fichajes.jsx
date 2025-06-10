import React, { useEffect, useState, useContext } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/Fichajes.css';
import { getFichajes, saveFichajes } from '../api';
import { AuthContext } from '../context/AuthContext';

const INICIO_VERANO = new Date('2025-06-15');
const FIN_VERANO    = new Date('2025-09-15');
const esVerano = fecha => fecha >= INICIO_VERANO && fecha <= FIN_VERANO;

const Fichajes = () => {
  const { usuario } = useContext(AuthContext);
  const id = usuario.id;
  const [fichajes, setFichajes] = useState({});
  const [mensaje, setMensaje] = useState('');

  const festivos = [
    '2025-01-01','2025-01-06','2025-04-17','2025-04-18',
    '2025-05-01','2025-05-02','2025-05-15','2025-07-25',
    '2025-08-15','2025-11-01','2025-11-10','2025-12-06',
    '2025-12-08','2025-12-25'
  ];

  useEffect(() => {
    (async () => {
      try {
        const data = await getFichajes(id);
        const inicial = {};
        data.forEach(f => {
          inicial[f.fecha] = true;
        });
        setFichajes(inicial);
      } catch {
        setMensaje('Error al cargar fichajes');
      }
    })();
  }, [id]);

  const mostrarMensaje = txt => {
    setMensaje(txt);
    setTimeout(() => setMensaje(''), 3000);
  };

  const manejarSeleccion = fecha => {
    if (fecha > new Date()) {
      return mostrarMensaje('No puedes fichar fechas futuras.');
    }
    const key = fecha.toISOString().split('T')[0];
    setFichajes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const guardar = async () => {
    try {
      const seleccionados = Object.entries(fichajes)
        .filter(([_, activo]) => activo)
        .map(([fecha]) => ({
          fecha_inicio: fecha,
          fecha_fin: fecha,
          estado: 'Fichado manual'
        }));

      await saveFichajes(id, { registros: seleccionados });
      mostrarMensaje('Fichajes guardados');
    } catch {
      mostrarMensaje('Error al guardar');
    }
  };

  const tileClassName = ({ date }) => {
    const iso = date.toISOString().split('T')[0];
    if (fichajes[iso]) return 'seleccionado-fichajes';
    if (festivos.includes(iso)) return 'rojo';
    if ([0,6].includes(date.getDay())) return 'gris';
    return null;
  };

  const totalHoras = Object.entries(fichajes)
    .reduce((sum, [fecha, activo]) => {
      if (!activo) return sum;
      const f = new Date(fecha);
      return sum + (esVerano(f) ? 6.5 : 8);
    }, 0).toFixed(1);

  return (
    <div className="fichajes-page">
      {mensaje && <div className="mensaje-emergente">{mensaje}</div>}
      <h2>Fichajes</h2>
      <Calendar
        tileClassName={tileClassName}
        onClickDay={manejarSeleccion}
      />
      <button className="btn-exportar" onClick={guardar}>
        Guardar fichajes
      </button>
      <p>Total horas trabajadas: {totalHoras}</p>
    </div>
  );
};

export default Fichajes;
