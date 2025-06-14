import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcryptjs';
import verificarToken from '../middlewares/verificarToken.js';

const router = express.Router();
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

// Actualizar usuario (solo para administradores o el mismo usuario)
router.put('/:id', async (req, res) => {
  const { nombre, email, contraseña, rol } = req.body;
  const { id } = req.params;

  try {
    // Obtener usuario actual
    const usuarioActual = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    if (usuarioActual.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const usuario = usuarioActual.rows[0];

    // No permitir cambiar el rol del administrador original
    if (usuario.email === 'admin@example.com' && rol && rol !== usuario.rol) {
      return res.status(403).json({ error: 'No se puede cambiar el rol del administrador principal.' });
    }

    // Procesar contraseña
    let nuevaContraseña = usuario.contraseña;

    if (contraseña && contraseña !== '') {
      // Si la nueva contraseña no empieza por "$2b$" asumimos que no está hasheada
      if (!contraseña.startsWith('$2b$')) {
        nuevaContraseña = await bcrypt.hash(contraseña, 10);
      } else {
        nuevaContraseña = contraseña;
      }
    }

    await pool.query(
      'UPDATE usuarios SET nombre = $1, email = $2, contraseña = $3, rol = $4 WHERE id = $5',
      [nombre, email, nuevaContraseña, rol || usuario.rol, id]
    );

    res.json({ mensaje: 'Usuario actualizado correctamente.' });

  } catch (err) {
    console.error('❌ Error al actualizar usuario:', err);
    res.status(500).json({ error: 'Error al actualizar usuario.' });
  }
});

export default router;
