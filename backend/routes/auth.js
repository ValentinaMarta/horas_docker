const bcrypt = require('bcryptjs');
const pool = require('../db');
const router = require('express').Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secreto-super-seguro';

router.post('/', async (req, res) => {
  const { email, contraseña } = req.body;
  console.log("📩 Login intento:", email);

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      console.log('❌ Usuario no encontrado');
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const usuario = result.rows[0];
    console.log('✅ Usuario encontrado:', usuario.email);
    console.log('🔐 Contraseña hash guardada:', usuario.contraseña);
    console.log('🔐 Contraseña ingresada:', contraseña);

    const match = await bcrypt.compare(contraseña, usuario.contraseña);
    console.log('🔍 Resultado de compare:', match);

    if (!match) {
      console.log('❌ Contraseña incorrecta');
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Si pasa, genera token
    const token = jwt.sign(
      {
        id: usuario.id,
        nombre: usuario.nombre || usuario.email,
        email: usuario.email,
        rol: (usuario.rol || '').toLowerCase().trim(),
      },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    console.log('✅ Login exitoso');
    res.json({ token });
  } catch (err) {
    console.error('🔥 Error en login:', err);
    res.status(500).json({ error: 'Error en login' });
  }
});


module.exports = router;
