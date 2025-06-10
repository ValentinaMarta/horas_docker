import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secreto-super-seguro';

function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.warn('🔐 Token no proporcionado en headers');
    return res.status(401).json({ error: 'Token requerido' });
  }

  const partes = authHeader.split(' ');
  if (partes.length !== 2 || partes[0] !== 'Bearer') {
    console.warn('⚠️ Formato del token incorrecto');
    return res.status(401).json({ error: 'Formato de token inválido' });
  }

  const token = partes[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('❌ Error al verificar el token:', err.message);
      return res.status(403).json({ error: 'Token inválido o expirado' });
    }

    req.usuario = decoded;
    next();
  });
}

export default verificarToken;
