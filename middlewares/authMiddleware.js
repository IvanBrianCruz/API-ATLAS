const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    console.log("🛠️ [AUTH MIDDLEWARE] Iniciando validación...");

    // 1️⃣ Obtener el encabezado Authorization
    const authHeader = req.header('Authorization');
    console.log("🔍 Header recibido:", authHeader);

    if (!authHeader) {
        console.log("❌ No se recibió un token.");
        return res.status(401).json({ mensaje: 'Acceso denegado, token requerido' });
    }

    // 2️⃣ Validar el formato "Bearer token"
    if (!authHeader.startsWith('Bearer ')) {
        console.log("❌ Formato de token incorrecto.");
        return res.status(400).json({ mensaje: 'Formato de token incorrecto, use Bearer token' });
    }

    // 3️⃣ Extraer el token
    const token = authHeader.split(' ')[1];
    console.log("🔑 Token extraído:", token);

    try {
        // 4️⃣ Verificar el token con JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token verificado con éxito:", decoded);

        // 5️⃣ Asignar el usuario al request
        req.user = decoded;

        // 6️⃣ Verificar si el usuario es admin
        if (req.user.role !== 'admin') {
            console.log("🚫 Usuario sin permisos:", req.user.email);
            return res.status(403).json({ mensaje: 'Acceso denegado, permisos insuficientes' });
        }

        console.log("✅ Usuario autorizado:", req.user.email);
        next(); // Pasar al siguiente middleware o controlador

    } catch (error) {
        console.log("❌ Error en verificación de token:", error.message);
        res.status(403).json({ mensaje: 'Token inválido' });
    }
};
