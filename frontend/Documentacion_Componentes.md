
# 📘 Documentación de Componentes y Utilidades

## 🧩 Componentes (`/components`)

### 1. `Landing.jsx`
- Componente principal de la página de inicio.
- Contiene:
  - `Navbar` (barra de navegación).
  - `CalendarioAnual` (vista escritorio).
  - `CalendarioCarrusel` (vista móvil).
  - Leyenda de colores.
  - Sección informativa (jornada laboral y festivos en columnas).
- Es el punto de entrada visual de la aplicación.

### 2. `Navbar.jsx`
- Muestra el logo y el botón “Entrar/Salir” según el estado de `logueado`.
- Fijo en la parte superior.

### 3. `CalendarioAnual.jsx`
- Muestra el calendario de los 12 meses del año en formato de cuadrícula (vista de escritorio).
- Oculto en móviles mediante media queries.

### 4. `CalendarioCarrusel.jsx`
- Muestra un solo mes con botones de navegación (◀ ▶).
- Visible solo en dispositivos móviles.

### 5. `Mes.jsx`
- Renderiza un bloque mensual:
  - Cabecera con días de la semana.
  - Celdas de días con clases según color (`azul`, `amarillo`, etc.).
- Utilizado tanto por `CalendarioAnual` como por `CalendarioCarrusel`.

---

## 🧠 Utilidades (`/utils`)

### 1. `constantes.js`

```js
export const mesesDelAno = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];
```

- Contiene el array con los nombres de los meses para su uso en los calendarios y el carrusel.

### 2. `funcionesCalendario.js`
- Función `generarDiasDelMes(mesIndex)`:
  - Recibe el índice del mes (0-11).
  - Devuelve un array con los días de ese mes, asignando un color según:
    - Jornada de invierno (`azul`).
    - Jornada de verano (`amarillo`).
    - Fin de semana (`rosa`).
    - Festivos nacionales (`naranja`).
    - Festivos locales y autonómicos (`rojo`).
    - Días fuera de mes (`gris`).
  - Aplica criterios basados en el calendario laboral 2025 de la Comunidad de Madrid.

---

## 📂 Datos (`/data`)

### 1. `calendario_2025.json`
- Puede ser utilizado para cargar dinámicamente días festivos u otros datos específicos del año.
- En el estado actual, el calendario está generado por lógica de fechas en `funcionesCalendario.js`, por lo que este archivo no se está utilizando directamente (podría usarse para versiones futuras dinámicas).
