import React from 'react';
/*import Navbar from './Navbar';*/
import CalendarioAnual from './CalendarioAnual';
import CalendarioCarrusel from './CalendarioCarrusel';
import '../styles/Landing.css';
import '../styles/CalendarioAnual.css';
import '../styles/CalendarioCarrusel.css';
import '../styles/ColoresCalendario.css';

const Landing = ({ logueado, onLoginClick, onLogoutClick }) => {
  return (
    <div>
 

      <main className="landing-contenido">
        <h1 className="titulo-landing">Registro de horas y vacaciones</h1>

        {/* Vista escritorio */}
        <CalendarioAnual />

        {/* Vista móvil */}
        <CalendarioCarrusel />

        <div className="leyenda-colores">
          <div><span className="cuadro azul" /> Jornada de invierno</div>
          <div><span className="cuadro amarillo" /> Jornada de verano</div>
          <div><span className="cuadro naranja" /> Festivo nacional</div>
          <div><span className="cuadro rojo" /> Festivo local</div>
          <div><span className="cuadro rosa" /> Fin de semana</div>
          <div><span className="cuadro gris" /> Día fuera de mes</div>
        </div>

        {/* Info adicional */}
        <div className="info-calendario">
          <div className="info-columna">
            <h3>Jornada Laboral</h3>
            <ul>
              <li>🔵 Jornada de invierno: 8 horas</li>
              <li>🟡 Jornada de verano: 6,5 horas</li>  
              <li>☀️ Verano: del <strong>15 de junio</strong> al <strong>15 de septiembre</strong></li>
            </ul>
            <h3>Festivos 2025 Comunidad de Madrid</h3>
            <ul >
              <li>🔴 2 mayo – Comunidad de Madrid</li>
              <li>🔴 8 diciembre – Inmaculada</li>
            </ul>
            <h3>Festivos 2025 Municipio de Madrid</h3>
            <ul >
              <li>🔴 15 mayo – San Isidro</li>
              <li>🔴 10 noviembrie– Traslado por Todos los Santos</li>
            </ul>
          </div>
          <div className="info-columna">
            <h3>Festivos 2025 (Madrid)</h3>
            <ul >
              <li>🟠 1 enero – Año Nuevo</li>
              <li>🟠 6 enero – Reyes</li>
              <li>🟠 17 abril – Jueves Santo</li>
              <li>🟠 18 abril – Viernes Santo</li>
              <li>🟠 1 mayo – Día del Trabajo</li>
              <li>🟠 25 julio – Santiago Apóstol</li>
              <li>🟠 15 agosto – Asunción</li>
              <li>🟠 1 noviembre – Todos los Santos</li>
              <li>🟠 10 noviembre – Traslado festivo</li>
              <li>🟠 6 diciembre – Constitución</li>
              <li>🟠 25 diciembre – Navidad</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
