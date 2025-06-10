import express from 'express';
import pool from '../db.js';

const router = express.Router();
// Obtener vacaciones por ID de usuario
router.get('/usuario/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT v.*, u.nombre, u.email
      FROM vacaciones v
      JOIN usuarios u ON u.id = v.usuario_id
      WHERE usuario_id = $1
      ORDER BY fecha_inicio
    `;
    const result = await pool.query(query, [id]);
    const nombre = result.rows.length ? result.rows[0].nombre : '';
    const email = result.rows.length ? result.rows[0].email || '' : '';
    res.json({ vacaciones: result.rows, nombre, email });
  } catch (error) {
    console.error('❌ Error al obtener vacaciones:', error.message);
    res.status(500).json({ error: 'Error al obtener vacaciones' });
  }
});

// Guardar registros de vacaciones
router.post('/usuario/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { registros } = req.body; // [{ fecha_inicio, fecha_fin, estado }]
    const insertQuery = `
      INSERT INTO vacaciones (usuario_id, fecha_inicio, fecha_fin, estado)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (usuario_id, fecha_inicio) DO NOTHING
    `;

    for (const reg of registros) {
      await pool.query(insertQuery, [id, reg.fecha_inicio, reg.fecha_fin, reg.estado]);
    }

    res.status(201).json({ mensaje: 'Vacaciones guardadas correctamente' });
  } catch (error) {
    console.error('❌ Error al guardar vacaciones:', error.message);
    res.status(500).json({ error: 'Error al guardar vacaciones' });
  }
});

export default router;



