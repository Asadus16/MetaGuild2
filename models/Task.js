const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../database");
var bcrypt = require("bcryptjs");

class Task extends Model {}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    smartContract: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING(100),
    },
    description: {
      type: DataTypes.STRING(100),
    },
    status: {
      type: DataTypes.ENUM("todo", "in_progress", "in_review", "complete"),
      defaultValue: "todo",
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false,
      set(value) {
        var salt = bcrypt.genSaltSync(8);
        var hash = bcrypt.hashSync(value, salt);
        this.setDataValue("password", hash);
      },
    },
    picture: {
      type: DataTypes.STRING(100),
    },
    account_status: {
      type: DataTypes.ENUM("active", "inactive", "suspended"),
      defaultValue: "active",
    },
    payment: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    // Other model options go here
    sequelize,
    modelName: "Task",
    tableName: "tasks",
    timestamps: true,
    indexes: [{ unique: true, fields: ["id"] }],
  }
);

// the defined model is the class itself
console.log(Task === sequelize.models.Task); // true

// (async () => {
//   await sequelize.sync({ alter: true });
//   // Code here
// })();

module.exports = Task;
