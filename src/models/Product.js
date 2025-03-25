const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    name: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    description: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    price: { 
      type: DataTypes.DECIMAL(10, 2), 
      allowNull: false 
    },
    stock: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    imageUrl: { 
      type: DataTypes.STRING, 
      allowNull: false 
    }
  }, {
    timestamps: true
  });

  return Product;
};
