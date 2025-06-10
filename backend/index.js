import express from 'express';
import cors from 'cors';
import pool from './db.js';

import authRoutes from './routes/auth.js';
import usuariosRoutes from './routes/usuarios.js';
import vacacionesRoutes from './routes/vacaciones.js';

const app = express();

app.use(express.json());
app.use(cors());

// Rutas
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