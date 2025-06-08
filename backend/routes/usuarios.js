const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const verificarToken = require('../middlewares/verificarToken');

const SALT_ROUNDS = 10;

// Obtener lista de usuarios, opcionalmente filtrados por rol
router.get('/', verificarToken, async (req, res) => {
  try {
    const rol = req.query.rol;
    let result;

    if (rol) {
      result = await pool.query(
        'SELECT id, nombre, email, rol FROM usuarios WHERE rol = $1',
        [rol]
      );
    } else {
      result = await pool.query(
        'SELECT id, nombre, email, rol FROM usuarios'
      );
    }

    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Registrar nuevo usuario (solo para administradores)
router.post('/registrar', verificarToken, async (req, res) => {
  try {
    if (req.usuario.rol !== 'administrador') {
      return res.status(403).json({ error: 'Solo los administradores pueden registrar usuarios.' });
    }

    const { nombre, email, contraseña, rol } = req.body;
    const hash = await bcrypt.hash(contraseña, SALT_ROUNDS);

    await pool.query(
      'INSERT INTO usuarios (nombre, email, contraseña, rol, fecha) VALUES ($1, $2, $3, $4, NOW())',
      [nombre, email, hash, rol]
    );

    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('❌ Error al registrar usuario:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
