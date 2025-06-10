import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/FichaUsuario.css';
import { generarExcelDesdeBD } from '../utils/exportExcel';
import { getVacaciones, getFichajes, updateUsuario } from '../api';
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

  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', rol: '', contraseña: '' });

  const festivos = ['2025-01-01', '2025-01-06', '2025-04-17', '2025-04-18', '2025-05-01',
    '2025-05-02', '2025-05-15', '2025-07-25', '2025-08-15', '2025-11-01',
    '2025-11-10', '2025-12-06', '2025-12-08', '2025-12-25'];

  const INICIO_VERANO = new Date('2025-06-15');
  const FIN_VERANO = new Date('2025-09-15');
  const esVerano = (fecha) => fecha >= INICIO_VERANO && fecha <= FIN_VERANO;

  useEffect(() => {
    if (!id) return; // Esperamos hasta tener el id definido
  
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
        console.error('Error al cargar datos:', err);
        setMensaje('Error al cargar los datos del usuario.');
      }
    };
  
    cargarDatos();
  }, [id]);

  useEffect(() => {
    setForm({ nombre, email, rol, contraseña: '' });
  }, [nombre, email, rol]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const guardarCambios = async () => {
    try {
      const datos = {
        nombre: form.nombre,
        email: form.email,
        rol: form.rol,
      };
      if (form.contraseña && form.contraseña.trim() !== '') {
        datos.contraseña = form.contraseña;
      }
      await updateUsuario(id, datos);
      setNombre(form.nombre);
      setEmail(form.email);
      setRol(form.rol);
      setEditando(false);
      mostrarMensaje('Datos actualizados correctamente');
    } catch (err) {
      mostrarMensaje('Error al guardar cambios');
    }
  };

  return (
    <div className="ficha-usuario">
      {mensaje && <div className="mensaje-emergente">{mensaje}</div>}

      {editando ? (
        <div className="form-edicion">
          <input name="nombre" value={form.nombre} onChange={handleChange} />
          <input name="email" value={form.email} onChange={handleChange} />
          <select name="rol" value={form.rol} onChange={handleChange}>
            <option value="administrador">Administrador</option>
            <option value="empleado">Empleado</option>
          </select>
          <input
            name="contraseña"
            type="password"
            value={form.contraseña}
            placeholder="Nueva contraseña (opcional)"
            onChange={handleChange}
          />
          <button onClick={guardarCambios}>Guardar</button>
          <button onClick={() => setEditando(false)}>Cancelar</button>
        </div>
      ) : (
        <div className="ficha-header">
          <h2>{nombre}</h2>
          <p>{email} — {rol}</p>
          {usuario?.rol === 'administrador' && <button onClick={() => setEditando(true)}>Editar</button>}
        </div>
      )}

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
