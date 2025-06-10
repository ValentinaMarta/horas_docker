// src/components/Panel.jsx
import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import Perfil from './Perfil';
import Usuarios from './Usuarios';
import FichaUsuario from './FichaUsuario';
import Vacaciones from './Vacaciones';    // <-- Importa el nuevo componente
import Fichajes from './Fichajes';        // <-- Importa el nuevo componente
import '../styles/Panel.css';
import { AuthContext } from '../context/AuthContext';

const Panel = () => {
  const { usuario } = useContext(AuthContext);
  const [pestana, setPestana] = useState('perfil');
  const { id } = useParams();

  const renderContenido = () => {
    if (!usuario) return <div>No autorizado</div>;

    // Si hay id en la URL, mostrar la ficha del usuario seleccionado
    if (id) return <FichaUsuario usuarioId={id} />;

    switch (pestana) {
      case 'perfil':
        return <Perfil />;
      case 'usuarios':
        return usuario.rol === 'administrador'
          ? <Usuarios />
          : <div>No tienes permiso para ver esta sección.</div>;
      case 'fichajes':
        return <Fichajes />;     // <-- Pestaña fichajes
      case 'vacaciones':
        return <Vacaciones />;   // <-- Pestaña vacaciones
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
