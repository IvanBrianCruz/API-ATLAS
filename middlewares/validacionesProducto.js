const { body, param } = require('express-validator');

const validarProducto = [
  body('name')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 240 }).withMessage('El nombre no puede tener más de 240 caracteres')
    .trim().escape(),

  body('category')
    .notEmpty().withMessage('La categoría es obligatoria')
    .isLength({ max: 240 }).withMessage('La categoría no puede tener más de 240 caracteres')
    .trim().escape(),

  body('description')
    .optional()
    .isString().withMessage('La descripción debe ser un texto')
    .trim().escape(),

  body('price')
    .notEmpty().withMessage('El precio es obligatorio')
    .isDecimal({ decimal_digits: '0,2' }).withMessage('El precio debe ser un número con hasta dos decimales')
    .custom((value) => {
      if (parseFloat(value) < 0) {
        throw new Error('El precio no puede ser negativo');
      }
      return true;
    }),

  body('imageUrl')
    .optional()
    .isURL().withMessage('La URL de la imagen no es válida'),
];

const validarId = [
  param('id')
    .isInt().withMessage('El ID debe ser un número entero'),
];

module.exports = { validarProducto, validarId };
