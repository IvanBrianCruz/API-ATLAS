// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validarRegistro, validarLogin } = require('../middlewares/validacionesAuth');

// Rutas públicas
router.post('/registro', validarRegistro, authController.registro);
router.post('/login', validarLogin, authController.login);

// Ruta protegida - verificar token
router.get('/verify', authMiddleware, authController.verifyToken);

module.exports = router;