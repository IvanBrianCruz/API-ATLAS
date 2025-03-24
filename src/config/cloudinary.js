const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'productos', // Carpeta en Cloudinary
    format: async () => 'png', // Formato de las imágenes
    public_id: (req, file) => `${Date.now()}-${file.originalname}`
  }
});

module.exports = { cloudinary, storage };
