import React, { useRef, useState, useEffect, useContext } from 'react';
import '../styles/LoginModal.css';
import { AuthContext } from '../context/AuthContext';
import jwt_decode from 'jwt-decode';

const API = '/login';

const LoginModal = ({ onClose, onLoginSuccess }) => {
  const inputRef = useRef(null);
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [error, setError] = useState('');

  const { setUsuario } = useContext(AuthContext);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const manejarLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log('📤 Enviando login:', { email, contraseña });
      const respuesta = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, contraseña }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        localStorage.setItem('token', datos.token);
        const decoded = jwt_decode(datos.token);
        setUsuario(decoded); // Actualiza AuthContext con id, nombre, email, rol
        onLoginSuccess(datos.token);
        onClose();
      } else if (respuesta.status === 401) {
        setError('Usuario o contraseña incorrectos');
      } else if (respuesta.status === 403) {
        setError('Sesión expirada, vuelve a entrar');
      } else {
        setError(datos.error || 'Error inesperado al iniciar sesión');
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="modal-login-overlay" role="dialog" aria-modal="true">
      <div className="modal-login-contenido">
        <button className="modal-cerrar" onClick={onClose} aria-label="Cerrar">×</button>
        <h2>Iniciar sesión</h2>
        <form onSubmit={manejarLogin}>
          <input
            ref={inputRef}
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div style={{ position: 'relative' }}>
            <input
              type={mostrarContraseña ? 'text' : 'password'}
              placeholder="Contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setMostrarContraseña(!mostrarContraseña)}
              aria-label={mostrarContraseña ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {mostrarContraseña ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17.94 17.94A10 10 0 0 1 6.06 6.06" />
                  <path d="M1 1l22 22" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8S2 12 2 12z" />
                </svg>
              )}
            </button>
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button type="submit">Entrar</button>
        </form>
        <button onClick={onClose} className="volver-inicio">Volver al inicio</button>
      </div>
    </div>
  );
};

export default LoginModal;
