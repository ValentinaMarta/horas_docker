import React, { useState } from 'react';
import Mes from './Mes';
import { mesesDelAno } from '../utils/constantes';
import { generarDiasDelMes } from '../utils/funcionesCalendario';
import '../styles/CalendarioCarrusel.css';
import '../styles/ColoresCalendario.css';

const CalendarioCarrusel = () => {
  const [mesActual, setMesActual] = useState(new Date().getMonth());

  const cambiarMes = (incremento) => {
    setMesActual((prev) => (prev + incremento + 12) % 12);
  };

  const dias = generarDiasDelMes(mesActual);

  return (
    <div className="calendario-carrusel">
      <div className="navegacion">
        <button onClick={() => cambiarMes(-1)} className="flecha">◀</button>
        <h2>{mesesDelAno[mesActual].toUpperCase()}</h2>
        <button onClick={() => cambiarMes(1)} className="flecha">▶</button>
      </div>
      <Mes nombre={mesesDelAno[mesActual]} dias={dias} />
    </div>
  );
};

export default CalendarioCarrusel;
