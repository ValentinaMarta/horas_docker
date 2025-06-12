import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Obtener fichajes por ID de usuario
router.get('/usuario/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
        SELECT f.*, u.nombre, u.email
        FROM fichajes f
        JOIN usuarios u ON u.id = f.usuario_id
        WHERE f.usuario_id = $1
        ORDER BY f.fecha
    `;
    const result = await pool.query(query, [id]);
    const nombre = result.rows.length ? result.rows[0].nombre : '';
    const email = result.rows.length ? result.rows[0].email || '' : '';
    res.json({ fichajes: result.rows, nombre, email });
  } catch (error) {
    console.error('❌ Error al obtener ficajes:', error.message);
    res.status(500).json({ error: 'Error al obtener fichajes' });
  }
});

// Guardar nuevos fichajes (con actualización si ya existe)
router.post('/usuario/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { registros } = req.body;

    console.log('📝 Fichajes recibidos:', registros);

    const insertQuery = `
      INSERT INTO fichajes (usuario_id, fecha, hora_inicio, hora_fin)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (usuario_id, fecha)
      DO UPDATE SET hora_inicio = EXCLUDED.hora_inicio,
                    hora_fin = EXCLUDED.hora_fin
    `;

    for (const reg of registros) {
      await pool.query(insertQuery, [
        id,
        reg.fecha,
        reg.hora_inicio || '09:00:00',
        reg.hora_fin || '17:00:00'
      ]);
    }

    res.status(201).json({ mensaje: 'Fichajes guardados correctamente' });
  } catch (error) {
    console.error('❌ Error al guardar fichajes:', error.message);
    res.status(500).json({ error: 'Error al guardar fichajes' });
  }
});

export default router;
