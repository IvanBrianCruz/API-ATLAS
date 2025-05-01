// controllers/authController.js
const jwt = require('jsonwebtoken'); // Necesitarás instalar: npm install jsonwebtoken
const Usuario = require('../models/usuario');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');


class AuthController {
  // Registro de nuevo usuario
  async registro(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
  
    const { nombre, email, password, role } = req.body;
  
    try {
      // Verificar si el email ya existe
      let usuario = await Usuario.findOne({ where: { email } });
      if (usuario) {
        return res.status(400).json({ mensaje: 'El usuario ya existe' });
      }
  
      // Crear nuevo usuario
      usuario = await Usuario.create({
        nombre,
        email,
        password,
        role: role || 'user'
      });
  
      // Crear token de activación
      const activationToken = jwt.sign(
        { id: usuario.id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
  
      // Crear link de activación
      const activationLink = `https://api-atlas.vercel.app/api/auth/activar/${activationToken}`;
  
      // Configurar transporte
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
  
      // Enviar correo
      await transporter.sendMail({
        from: '"IES N6" <atlas@ies.com>',
        to: usuario.email,
        subject: 'Activa tu cuenta',
        html: `
          <h2>Bienvenido ${usuario.nombre}</h2>
          <p>Gracias por registrarte. Hacé clic en el siguiente botón para activar tu cuenta:</p>
          <a href="${activationLink}" style="padding: 10px 15px; background-color: #7494ec; color: #fff; text-decoration: none;">Activar cuenta</a>
          <p>O copia este enlace: ${activationLink}</p>
        `
      });
  
      // Enviar respuesta final al cliente
      res.status(201).json({
        mensaje: 'Usuario creado exitosamente. Revisá tu correo para activar la cuenta.',
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          role: usuario.role
        }
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al registrar usuario', error: error.message });
    }
  }
  
  // Activar cuenta de usuario
  async activarCuenta(req, res) {
    try {
      const { token } = req.params;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      const usuario = await Usuario.findByPk(decoded.id);
      if (!usuario) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
  
      if (usuario.activo) {
        return res.status(400).json({ mensaje: 'La cuenta ya está activada' });
      }
  
      usuario.activo = true;
      await usuario.save();
  
      return res.send('<h2>Cuenta activada correctamente</h2><p>Ahora podés iniciar sesión.</p>');
    } catch (error) {
      return res.status(400).send('<h2>Token inválido o expirado</h2>');
    }
  }
  
  // Login de usuario existente
  async login(req, res) {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Buscar usuario por email
      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas' });
      }

      // Verificar contraseña
      const passwordValido = await usuario.verificarPassword(password);
      if (!passwordValido) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas' });
      }

      // Verificar si el usuario está activo
      if (!usuario.activo) {
        return res.status(401).json({ mensaje: 'Usuario desactivado' });
      }

      // Generar token JWT
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email, role: usuario.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Enviar respuesta
      res.json({
        mensaje: 'Login exitoso',
        token,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          role: usuario.role
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
  }

  // Verificar el token y obtener información del usuario
  async verifyToken(req, res) {
    try {
      // El middleware authMiddleware ya verificó el token
      // y añadió req.user con la información del token
      
      // Buscar usuario en la base de datos para obtener información actualizada
      const usuario = await Usuario.findByPk(req.user.id, {
        attributes: ['id', 'nombre', 'email', 'role'] // Excluir campos sensibles
      });
      
      if (!usuario) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
      
      res.json({ 
        mensaje: 'Token válido', 
        usuario 
      });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al verificar token', error: error.message });
    }
  }
}

module.exports = new AuthController();