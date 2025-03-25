require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const sequelize = require('./config/database');
const productRoutes = require('./routes/productRoutes');

// Importar el modelo correctamente
const Product = require('./models/Product')(sequelize);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', productRoutes);

// Sincronizar modelos
sequelize.sync({ force: false })  // Aquí solo una vez
  .then(() => {
    console.log('📦 Base de datos sincronizada');
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en ${PORT}`));
  })
  .catch(err => console.error('❌ Error al sincronizar la BD:', err));
