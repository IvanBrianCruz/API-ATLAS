const Producto = require('../models/producto');

class ProductoController {
  // Crear nuevo producto
  async crearProducto(req, res) {
    const t = await sequelize.transaction();
    try {
      const nuevoProducto = await Producto.create(req.body, { transaction: t });
      await t.commit();
      res.status(201).json(nuevoProducto);
    } catch (error) {
      await t.rollback();
      res.status(400).json({
        mensaje: 'Error al crear el producto',
        error: error.message
      });
    }
  }

  async obtenerProductos(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
  
      const { count, rows: productos } = await Producto.findAndCountAll({
        limit,
        offset
      });
  
      res.json({
        totalProductos: count,
        paginaActual: page,
        totalPaginas: Math.ceil(count / limit),
        productos
      });
    } catch (error) {
      res.status(500).json({
        mensaje: 'Error al obtener productos',
        error: error.message
      });
    }
  }

  // Obtener producto por ID
  async obtenerProductoPorId(req, res) {
    try {
      const producto = await Producto.findByPk(req.params.id);
      if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
      }
      res.json(producto);
    } catch (error) {
      res.status(500).json({ 
        mensaje: 'Error al obtener el producto', 
        error: error.message 
      });
    }
  }

  // Actualizar producto
  async actualizarProducto(req, res) {
    try {
      const [actualizado] = await Producto.update(req.body, {
        where: { id: req.params.id }
      });

      if (actualizado) {
        const productoActualizado = await Producto.findByPk(req.params.id);
        return res.json(productoActualizado);
      }

      throw new Error('Producto no encontrado');
    } catch (error) {
      res.status(400).json({ 
        mensaje: 'Error al actualizar el producto', 
        error: error.message 
      });
    }
  }

  // Eliminar producto
  async eliminarProducto(req, res) {
    try {
      const eliminado = await Producto.destroy({
        where: { id: req.params.id }
      });

      if (eliminado) {
        return res.json({ mensaje: 'Producto eliminado exitosamente' });
      }

      throw new Error('Producto no encontrado');
    } catch (error) {
      res.status(400).json({ 
        mensaje: 'Error al eliminar el producto', 
        error: error.message 
      });
    }
  }
}

module.exports = new ProductoController();