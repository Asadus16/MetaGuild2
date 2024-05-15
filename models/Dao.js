const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../database");
var bcrypt = require("bcryptjs");
// const User = require("./User");
// const Task = require("./Task");
// const UserDao = require("./UserDao");

class Dao extends Model {}

Dao.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(100),
    },
    linkedin: {
      type: DataTypes.STRING(100),
    },
    website: {
      type: DataTypes.STRING(100),
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "Dao", // We need to choose the model name
    tableName: "daos",
    timestamps: true,
    indexes: [{ unique: true, fields: ["id"] }],
  }
);

// the defined model is the class itself
console.log(Dao === sequelize.models.Dao, "DAO REAL"); // true

// (async () => {
//   await sequelize.sync({ alter: true });
// })();

module.exports = Dao;
