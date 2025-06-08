import React from 'react';
import jwtDecode from 'jwt-decode';
import { Navigate } from 'react-router-dom'; 

const UsuariosAdmin = () => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" />;      

  let payload;
  try {
    payload = jwtDecode(token);
  } catch {
    return <Navigate to="/" />;
  }

  if (payload.rol !== 'administrador') {
    return <p>No tienes permiso para acceder a esta sección.</p>;
  }

  return (
    <div>
      <h2>Gestión de Usuarios (solo Admin)</h2>
      {/* Aquí vendrá el listado de usuarios, formularios, etc. */}
    </div>
  );
};

export default UsuariosAdmin;
