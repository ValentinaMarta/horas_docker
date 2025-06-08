import React from 'react';
import '../styles/Navbar.css';
import logo from '../assets/logo.png';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Navbar = ({ logueado, usuario, onLoginClick, onLogoutClick }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Logo" />
      </div>

      <div className="navbar-user-info">
        {logueado && usuario && (
          <div className="usuario-logueado">
            <FaUserCircle className="icono-usuario" />
            <span>{usuario.nombre} ({usuario.rol})</span>
          </div>
        )}
        {logueado ? (
          <button className="btn-salir" onClick={onLogoutClick}>
            <FaSignOutAlt className="icono-salir" />
          </button>
        ) : (
          <button className="btn-entrar" onClick={onLoginClick}>
            Entrar
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
