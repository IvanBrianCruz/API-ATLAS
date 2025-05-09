require('pg'); // Forzar que Vercel la incluya en el bundle

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const sequelize = require('./config/database');
const productoRoutes = require('./routes/productoRoutes');
const authRoutes = require('./routes/authRoutes'); // Nueva importación

const app = express();

// Middleware de seguridad
app.use(helmet());

// Configuración de CORS
app.use(cors({
  origin: ['https://ivanbriancruz.github.io/CURSO_PSEINT', 'https://ivanbriancruz.github.io', 'http://localhost:5173', 'https://frontend-ten-lemon-21.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de registro
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Origen: ${req.headers.origin}`);
  next();
});

// Rutas
app.use('/api/auth', authRoutes); // Nueva ruta de autenticación
app.use('/api/productos', productoRoutes);

// Middleware de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    mensaje: 'Algo salió mal',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// Conexión a la base de datos e inicio del servidor
async function iniciarServidor() {
  try {
    const opciones = {
      alter: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production'
    };
    await sequelize.sync(opciones);
    console.log('Conexión a la base de datos establecida');
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
      console.log(`Modo: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
    process.exit(1);
  }
}

iniciarServidor();

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});