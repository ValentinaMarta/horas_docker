
import React, { useState } from 'react';
import { createUsuario } from '../api';
import { useNavigate } from 'react-router-dom';

const NuevoUsuario = () => {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'empleado' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUsuario(form);
      navigate('/usuarios');
    } catch (error) {
      alert('Error al crear usuario');
    }
  };

  return (
    <div className="panel">
      <h2>Nuevo Usuario</h2>
      <form onSubmit={handleSubmit}>
        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
        <input name="password" value={form.password} onChange={handleChange} placeholder="Contraseña" type="password" required />
        <select name="rol" value={form.rol} onChange={handleChange}>
          <option value="empleado">Empleado</option>
          <option value="admin">Administrador</option>
        </select>
        <button type="submit">Crear</button>
      </form>
    </div>
  );
};

export default NuevoUsuario;
