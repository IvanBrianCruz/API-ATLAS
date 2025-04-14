const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    freezeTableName: true
  },
  dialectOptions: {
    connectTimeout: 10000
  }
});

async function probarConexion() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL (Supabase) establecida correctamente.');
  } catch (error) {
    console.error('❌ Error de conexión con la base de datos PostgreSQL:', error);
  }
}

probarConexion();

module.exports = sequelize;
