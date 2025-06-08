
import React from 'react';
import Mes from './Mes';
import { mesesDelAno } from '../utils/constantes';
import { generarDiasDelMes } from '../utils/funcionesCalendario';
import '../styles/CalendarioAnual.css';
import '../styles/ColoresCalendario.css';

const CalendarioAnual = () => {
  return (
    <div className="calendario-anual">
      {mesesDelAno.map((mes, index) => {
        const diasMes = generarDiasDelMes(index);
        return <Mes key={index} nombre={mes} dias={diasMes} />;
      })}
    </div>
  );
};

export default CalendarioAnual;
