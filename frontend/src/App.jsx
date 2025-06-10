// src/App.jsx
import React, { useState, useEffect } from 'react';
import jwtDecode from "jwt-decode";
import { Routes, Route, useNavigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Landing from './components/Landing';
import LoginModal from './components/LoginModal';
import Panel from './components/Panel';
import { AuthContext } from './context/AuthContext';
import Vacaciones from './components/Vacaciones'; // o la ruta correcta
import Fichajes from './components/Fichajes'; // o la ruta correcta

function App() {
  const [logueado, setLogueado] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (Date.now() / 1000 < decoded.exp) {
          const userData = {
            id: decoded.id,
            nombre: decoded.nombre || decoded.email || 'Usuario',
            rol: decoded.rol,
            email: decoded.email
          };
          setUsuario(userData);
          setLogueado(true);
          navigate('/panel');
        } else {
          localStorage.removeItem('token');
        }
      } catch {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLoginSuccess = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    const userData = {
      id: decoded.id,
      nombre: decoded.nombre || decoded.email || 'Usuario',
      rol: decoded.rol,
      email: decoded.email
    };
    setUsuario(userData);
    setLogueado(true);
    setMostrarLogin(false);
    navigate('/panel');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLogueado(false);
    setUsuario(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ usuario, setUsuario }}>
      <Navbar
        logueado={logueado}
        onLoginClick={() => setMostrarLogin(true)}
        onLogoutClick={handleLogout}
        usuario={usuario}
      />

      <Routes>
        <Route path="/" element={<Landing logueado={logueado} />} />
        <Route path="/panel" element={<Panel />} />
        <Route path="/panel/:id" element={<Panel />} />
        <Route path="/vacaciones" element={<Vacaciones />} />
        <Route path="/fichajes"   element={<Fichajes />} />

      </Routes>

      {!logueado && mostrarLogin && (
        <LoginModal
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setMostrarLogin(false)}
        />
      )}
    </AuthContext.Provider>
  );
}

export default App;