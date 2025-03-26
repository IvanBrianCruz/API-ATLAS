const { Sequelize } = require('sequelize');
const mysql2 = require('mysql2'); // Asegura que mysql2 se carga



require('dotenv').config();

console.log('Configuración de base de datos:', {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  host: process.env.DB_HOST
});

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // Añade esta línea
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      // Evita que Sequelize pluralice los nombres de tabla
      freezeTableName: true
    },
    // Configuraciones de conexión adicionales
    dialectOptions: {
      connectTimeout: 10000 // 10 segundos
    }
  }
);

// Función de prueba de conexión
async function probarConexion() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida exitosamente.');
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error);
  }
}

// Ejecutar prueba de conexión
probarConexion();

module.exports = sequelize;