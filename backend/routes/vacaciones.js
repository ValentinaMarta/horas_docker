// routes/vacaciones.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener vacaciones/fichajes por ID de usuario
router.get('/usuario/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT v.*, u.nombre
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

// (Opcional futuro)
// Guardar registros de fichajes y vacaciones
// router.post('/usuario/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const registros = req.body; // [{ fecha_inicio, fecha_fin, estado, comentario_admin }]
//     const insertQuery = `
//       INSERT INTO vacaciones (usuario_id, fecha_inicio, fecha_fin, estado, comentario_admin)
//       VALUES ($1, $2, $3, $4, $5)
//     `;

//     for (const reg of registros) {
//       await pool.query(insertQuery, [id, reg.fecha_inicio, reg.fecha_fin, reg.estado, reg.comentario_admin || '']);
//     }

//     res.status(201).json({ mensaje: 'Registros guardados correctamente' });
//   } catch (error) {
//     console.error('❌ Error al guardar registros:', error.message);
//     res.status(500).json({ error: 'Error al guardar registros' });
//   }
// });

module.exports = router;
