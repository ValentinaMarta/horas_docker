
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/FichaUsuario.css';
import { generarExcelDesdeBD } from '../utils/exportExcel';
import { getVacaciones, getFichajes } from '../api';
import { AuthContext } from '../context/AuthContext';

const FichaUsuario = () => {
  const { id: idURL } = useParams();
  const { usuario } = useContext(AuthContext);
  const id = idURL || usuario?.id;

  const [vacaciones, setVacaciones] = useState({});
  const [fichajes, setFichajes] = useState({});
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('');
  const [mensaje, setMensaje] = useState('');

  const festivos = ['2025-01-01', '2025-01-06', '2025-04-17', '2025-04-18', '2025-05-01',
    '2025-05-02', '2025-05-15', '2025-07-25', '2025-08-15', '2025-11-01',
    '2025-11-10', '2025-12-06', '2025-12-08', '2025-12-25'];

  const INICIO_VERANO = new Date('2025-06-15');
  const FIN_VERANO = new Date('2025-09-15');
  const esVerano = (fecha) => fecha >= INICIO_VERANO && fecha <= FIN_VERANO;

  useEffect(() => {
    if (!id) return;

    const cargarDatos = async () => {
      try {
        const vacacionesData = await getVacaciones(id);
        const fichajesData = await getFichajes(id);

        const vac = {}, fich = {};
        setNombre(vacacionesData.nombre || 'Usuario');
        setEmail(vacacionesData.email || '');
        setRol(vacacionesData.rol || '');

        vacacionesData.vacaciones.forEach(v => {
          const inicio = new Date(v.fecha_inicio);
          const fin = new Date(v.fecha_fin);
          for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
            const key = d.toISOString().split('T')[0];
            if (v.estado === 'Solicitada') vac[key] = true;
          }
        });

        fichajesData.forEach(f => {
          const key = f.fecha;
          fich[key] = true;
        });

        setVacaciones(vac);
        setFichajes(fich);
      } catch (err) {
        setMensaje('Error al cargar los datos del usuario.');
      }
    };

    cargarDatos();
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
      if (fecha > new Date()) return mostrarMensaje('No puedes fichar fechas futuras.');
      if (vacaciones[key]) return mostrarMensaje('Ese día ya está marcado como vacaciones.');
      setFichajes(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const guardarVacaciones = async () => {
    try {
      const seleccionados = Object.entries(vacaciones).filter(([fecha, activo]) => activo);
      await fetch(`http://localhost:4000/vacaciones/usuario/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registros: seleccionados.map(([fecha]) => ({
            fecha_inicio: fecha,
            fecha_fin: fecha,
            estado: 'Solicitada'
          }))
        })
      });
      mostrarMensaje('Vacaciones guardadas');
    } catch (error) {
      mostrarMensaje('Error al guardar vacaciones');
    }
  };

  const guardarFichajes = async () => {
    try {
      const seleccionados = Object.entries(fichajes).filter(([fecha, activo]) => activo);
      await fetch(`http://localhost:4000/fichajes/usuario/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registros: seleccionados.map(([fecha]) => ({
            fecha_inicio: fecha,
            fecha_fin: fecha,
            estado: 'Fichado manual'
          }))
        })
      });
      mostrarMensaje('Fichajes guardados');
    } catch (error) {
      mostrarMensaje('Error al guardar fichajes');
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

  const exportar = () => {
    const registros = [];
    for (const [fecha, activo] of Object.entries(vacaciones)) {
      if (activo) registros.push({ fecha_inicio: fecha, fecha_fin: fecha, estado: 'Solicitada' });
    }
    for (const [fecha, activo] of Object.entries(fichajes)) {
      if (activo) registros.push({ fecha_inicio: fecha, fecha_fin: fecha, estado: 'Fichado manual' });
    }
    generarExcelDesdeBD({ nombre }, registros);
  };

  return (
    <div className="ficha-usuario">
      {mensaje && <div className="mensaje-emergente">{mensaje}</div>}

      <div className="ficha-header">
        <h2>{nombre}</h2>
        <p>{email} — {rol}</p>
      </div>

      <div className="calendarios-container">
        <div className="calendario-bloque">
          <h3>Calendario de Vacaciones</h3>
          <Calendar
            tileClassName={tileClassNameVacaciones}
            onClickDay={(date) => manejarSeleccion(date, 'Solicitada')}
          />
          <button className="btn-exportar"  onClick={guardarVacaciones}>Guardar vacaciones</button>
        </div>

        <div className="calendario-bloque">
          <h3>Calendario de Fichajes</h3>
          <Calendar
            tileClassName={tileClassNameFichajes}
            onClickDay={(date) => manejarSeleccion(date, 'Fichado manual')}
          />
          <button className="btn-exportar" onClick={guardarFichajes}>Guardar fichajes</button>
        </div>
      </div>

      <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>
        Días de vacaciones gastados: {Object.values(vacaciones).filter(Boolean).length} <br />
        Total horas trabajadas: {
          Object.entries(fichajes).reduce((sum, [fecha, activo]) => {
            if (!activo) return sum;
            const f = new Date(fecha);
            return sum + (esVerano(f) ? 6.5 : 8);
          }, 0).toFixed(1)
        }
      </div>

      <button className="btn-exportar" onClick={exportar}>
        Exportar a Excel
      </button>
    </div>
  );
};

export default FichaUsuario;
