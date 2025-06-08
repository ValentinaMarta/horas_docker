
import React, { useState, useEffect } from 'react';
import { updateUsuario, getUsuarios } from '../api';
import { useParams, useNavigate } from 'react-router-dom';

const EditarUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', email: '', rol: 'empleado' });

  useEffect(() => {
    const fetchUsuario = async () => {
      const lista = await getUsuarios();
      const usuario = lista.find(u => u.id.toString() === id);
      if (usuario) {
        setForm(usuario);
      } else {
        alert('Usuario no encontrado');
        navigate('/usuarios');
      }
    };
    fetchUsuario();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUsuario(id, form);
      navigate('/usuarios');
    } catch (error) {
      alert('Error al actualizar usuario');
    }
  };

  return (
    <div className="panel">
      <h2>Editar Usuario</h2>
      <form onSubmit={handleSubmit}>
        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
        <select name="rol" value={form.rol} onChange={handleChange}>
          <option value="empleado">Empleado</option>
          <option value="admin">Administrador</option>
        </select>
        <button type="submit">Guardar cambios</button>
      </form>
    </div>
  );
};

export default EditarUsuario;
