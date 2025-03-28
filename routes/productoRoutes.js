const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validarProducto, validarId } = require('../middlewares/validacionesProducto');

// Rutas protegidas con validaciones
router.post('/', authMiddleware, validarProducto, productoController.crearProducto);
router.put('/:id', authMiddleware, validarId, validarProducto, productoController.actualizarProducto);
router.delete('/:id', authMiddleware, validarId, productoController.eliminarProducto);

// Rutas públicas
router.get('/', productoController.obtenerProductos);
router.get('/:id', validarId, productoController.obtenerProductoPorId);

module.exports = router;
