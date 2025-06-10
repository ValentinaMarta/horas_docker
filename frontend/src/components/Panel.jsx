// src/components/Panel.jsx
import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import Perfil from './Perfil';
import Usuarios from './Usuarios';
import FichaUsuario from './FichaUsuario';
import '../styles/Panel.css';
import { AuthContext } from '../context/AuthContext';

const Panel = () => {
  const { usuario } = useContext(AuthContext);
  const [pestana, setPestana] = useState('perfil');
  const { id } = useParams();

  const renderContenido = () => {
    if (!usuario) return <div>No autorizado</div>;

    if (id) return <FichaUsuario />;

    switch (pestana) {
      case 'perfil':
        return <Perfil />;
      case 'usuarios':
        return usuario.rol === 'administrador' ? <Usuarios /> : <div>No tienes permiso para ver esta sección.</div>;
      case 'fichajes':
        return <div>Página de fichajes (en construcción)</div>;
      case 'vacaciones':
        return <div>Página de vacaciones (en construcción)</div>;
      default:
        return <Perfil />;
    }
  };

  return (
    <div className="panel-container">
      <Sidebar rol={usuario?.rol} setPestana={setPestana} pestanaActiva={pestana} />
      <main className="panel-main">
        {renderContenido()}
      </main>
    </div>
  );
};

export default Panel;