import React, { useEffect, useState, useContext } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/Vacaciones.css';
import { getVacaciones, saveVacaciones } from '../api';
import { AuthContext } from '../context/AuthContext';

const Vacaciones = () => {
  const { usuario } = useContext(AuthContext);
  const id = usuario.id;
  const [vacaciones, setVacaciones] = useState({});
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
        const data = await getVacaciones(id);
        const inicial = {};
        data.vacaciones.forEach(v => {
          const inicio = new Date(v.fecha_inicio);
          const fin = new Date(v.fecha_fin);
          for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
            if (v.estado === 'Solicitada') {
              inicial[d.toISOString().split('T')[0]] = true;
            }
          }
        });
        setVacaciones(inicial);
      } catch {
        setMensaje('Error al cargar vacaciones');
      }
    })();
  }, [id]);

  const mostrarMensaje = txt => {
    setMensaje(txt);
    setTimeout(() => setMensaje(''), 3000);
  };

  const manejarSeleccion = fecha => {
    const key = fecha.toISOString().split('T')[0];
    setVacaciones(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const guardar = async () => {
    try {
      const seleccionados = Object.entries(vacaciones)
        .filter(([_, activo]) => activo)
        .map(([fecha]) => ({
          fecha_inicio: fecha,
          fecha_fin: fecha,
          estado: 'Solicitada'
        }));

      await saveVacaciones(id, { registros: seleccionados });
      mostrarMensaje('Vacaciones guardadas');
    } catch {
      mostrarMensaje('Error al guardar');
    }
  };

  const tileClassName = ({ date }) => {
    const iso = date.toISOString().split('T')[0];
    if (vacaciones[iso]) return 'seleccionado-vacaciones';
    if (festivos.includes(iso)) return 'rojo';
    if ([0,6].includes(date.getDay())) return 'gris';
    return null;
  };

  const diasGastados = Object.values(vacaciones).filter(Boolean).length;

  return (
    <div className="vacaciones-page">
      {mensaje && <div className="mensaje-emergente">{mensaje}</div>}
      <h2>Vacaciones</h2>
      <Calendar
        tileClassName={tileClassName}
        onClickDay={manejarSeleccion}
      />
      <button className="btn-exportar" onClick={guardar}>
        Guardar vacaciones
      </button>
      <p>Días gastados: {diasGastados}</p>
    </div>
  );
};

export default Vacaciones;
