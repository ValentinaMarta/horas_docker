import React from 'react';

const Mes = ({ nombre, dias }) => {
  return (
    <div className="mes">
      <div className="mes-nombre">{nombre.toUpperCase()}</div>
      <div className="cabecera">
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((dia, index) => (
          <div key={index} className="dia-semana">{dia}</div>
        ))}
      </div>
      <div className="cuadricula">
        {dias.map((dia, index) => (
          <div key={index} className={`celda ${dia.color}`}>
            {dia.numero}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mes;
