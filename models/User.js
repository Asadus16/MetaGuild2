const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    smartContract: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    roles: {
      type: DataTypes.ENUM('member', 'admin', 'co_Admin'),
      defaultValue: 'active',
    },
    // Model attributes are defined here
    firstName: {
      type: DataTypes.STRING(100),
    },
    lastName: {
      type: DataTypes.STRING(100),
      // allowNull defaults to true
    },
    picture: {
      type: DataTypes.STRING(100),
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'User', // We need to choose the model name
    tableName: 'users',
    timestamps: true,
    indexes: [{ unique: true, fields: ['id'] }],
  }
);

// the defined model is the class itself
console.log(User === sequelize.models.User); // true

module.exports = User;
