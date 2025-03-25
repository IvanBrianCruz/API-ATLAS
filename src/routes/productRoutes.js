const express = require('express');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const productController = require('../controllers/productController');

const router = express.Router();
const upload = multer({ storage });

router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', upload.single('imageUrl'), productController.createProduct);
router.put('/products/:id', upload.single('image'), productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;
