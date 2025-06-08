const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

app.use(express.json());
app.use(cors());

// Rutas
const authRoutes = require('./routes/auth');
const usuariosRoutes = require('./routes/usuarios');
const vacacionesRoutes = require('./routes/vacaciones'); 

app.use('/login', authRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/vacaciones', vacacionesRoutes);

app.get('/', (req, res) => {
  res.send('API de Horas funcionando ✅');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
