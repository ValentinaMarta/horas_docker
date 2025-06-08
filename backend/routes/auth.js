const bcrypt = require('bcryptjs');
const pool = require('../db');
const router = require('express').Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secreto-super-seguro';

router.post('/', async (req, res) => {
  console.log("📩 Body recibido:", req.body);

  const { email, contraseña } = req.body;

  console.log('🔐 Login intento:', email);

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      console.log('❌ Usuario no encontrado');
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const usuario = result.rows[0];
    console.log('✅ Usuario encontrado:', usuario.email);

    const match = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!match) {
      console.log('❌ Contraseña incorrecta');
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({
      id: usuario.id,
      nombre: usuario.nombre || usuario.email,
      email: usuario.email,
      rol: usuario.rol
    }, JWT_SECRET, { expiresIn: '2h' });

    console.log('✅ Login correcto, token generado');
    res.status(200).json({ token });

  } catch (err) {
    console.error("❌ Error en login:", err.message);
    console.error('🔥 ERROR FATAL en login:', err);
    res.status(500).json({ error: 'Error al hacer login' });
  }
  
});

module.exports = router;
