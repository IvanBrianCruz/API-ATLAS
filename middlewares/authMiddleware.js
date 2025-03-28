const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const token = req.header('Authorization'); // Obtener token desde encabezados

  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado, token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); // Pasar al siguiente middleware
  } catch (error) {
    res.status(403).json({ mensaje: 'Token inválido' });
  }
};
