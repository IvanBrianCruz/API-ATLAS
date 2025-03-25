const sequelize = require('../config/database'); // Importar sequelize desde la configuración
const Product = require('../models/Product')(sequelize); // Pasar sequelize al modelo
const { cloudinary } = require('../config/cloudinary');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    if (!imageUrl) return res.status(400).json({ error: 'Imagen es requerida' });

    const newProduct = await Product.create({ name, description, price, stock, imageUrl });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    const { name, description, price, stock } = req.body;
    let imageUrl = product.imageUrl;

    if (req.file) {
      await cloudinary.uploader.destroy(product.imageUrl.split('/').pop().split('.')[0]); // Borra la imagen anterior
      imageUrl = req.file.path;
    }

    await product.update({ name, description, price, stock, imageUrl });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    await cloudinary.uploader.destroy(product.imageUrl.split('/').pop().split('.')[0]); // Borra la imagen en Cloudinary
    await product.destroy();
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};
