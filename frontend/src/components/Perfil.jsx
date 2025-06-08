
import React, { useContext } from 'react';
import FichaUsuario from './FichaUsuario';
import { AuthContext } from '../context/AuthContext';

const Perfil = () => {
  const { usuario } = useContext(AuthContext);

  if (!usuario) return <p>Cargando...</p>;

  return (
    <div className="panel">
      <h2>Mi Perfil</h2>
      <FichaUsuario idUsuario={usuario.id} />
    </div>
  );
};

export default Perfil;
