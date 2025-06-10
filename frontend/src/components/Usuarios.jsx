// src/components/Usuarios.jsx
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getUsuarios, createUsuario } from '../api';
import { useNavigate } from 'react-router-dom';

const Usuarios = () => {
  const { usuario, loading } = useContext(AuthContext);
  const [usuarios, setUsuarios] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: '', email: '', contraseña: '', rol: 'empleado' });
  const navigate = useNavigate();

  useEffect(() => {
    if (usuario?.rol === 'administrador') {
      cargarUsuarios();
    }
  }, [usuario]);

  const cargarUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      await createUsuario(nuevo);
      await cargarUsuarios();
      setNuevo({ nombre: '', email: '', contraseña: '', rol: 'empleado' });
    } catch (err) {
      alert('Error al crear usuario');
    }
  };

  if (loading) return <p>Cargando…</p>;
  if (!usuario) {
    console.log("🚫 Usuario nulo en Usuarios.jsx");
    return <p>Usuario no autenticado.</p>;
  }

  console.log("🧪 Usuario en Usuarios.jsx:", usuario);

  if (usuario.rol !== 'administrador') return <p>No tienes permiso para ver esta sección.</p>;

  return (
    <div className="panel" style={{ padding: '2rem' }}>
      <h2>Gestión de Usuarios</h2>

      <form onSubmit={handleCrear} style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Nombre"
          value={nuevo.nombre}
          onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={nuevo.email}
          onChange={(e) => setNuevo({ ...nuevo, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={nuevo.contraseña}
          onChange={(e) => setNuevo({ ...nuevo, contraseña: e.target.value })}
          required
        />
        <select
          value={nuevo.rol}
          onChange={(e) => setNuevo({ ...nuevo, rol: e.target.value })}
        >
          <option value="empleado">Empleado</option>
          <option value="administrador">Administrador</option>
        </select>
        <button type="submit">Crear Usuario</button>
      </form>

      <ul>
        {usuarios.map((u) => (
          <li
            key={u.id}
            style={{ cursor: 'pointer', marginBottom: '0.5rem' }}
            onClick={() => navigate(`/panel/${u.id}`)}
          >
            {u.nombre} – {u.email} ({u.rol})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Usuarios;