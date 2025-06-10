// src/components/Sidebar.jsx
import React from 'react';
import '../styles/Sidebar.css';

const Sidebar = ({ rol, setPestana, pestanaActiva }) => {
  const renderOpcion = (clave, icono, texto) => (
    <li
      className={pestanaActiva === clave ? 'activo' : ''}
      onClick={() => setPestana(clave)}
    >
      {icono} {texto}
    </li>
  );

  return (
    <aside className="sidebar">
      <ul>
        {renderOpcion('perfil', '👤', 'Perfil')}

        {rol === 'administrador' && (
          <>
            {renderOpcion('fichajes', '📊', 'Fichajes')}
            {renderOpcion('vacaciones', '📅', 'Vacaciones')}
            {renderOpcion('usuarios', '📁', 'Usuarios')}
          </>
        )}

        {rol === 'empleado' && (
          <>
            {renderOpcion('registro', '🕓', 'Registrar horas')}
            {renderOpcion('vacaciones', '📅', 'Mis vacaciones')}
            {renderOpcion('notificaciones', '🔔', 'Notificaciones')}
          </>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
