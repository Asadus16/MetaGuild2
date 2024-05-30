const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../database");
var bcrypt = require("bcryptjs");
const Dao = require("./Dao");

class Task extends Model {}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(100),
    },
    status: {
      type: DataTypes.ENUM("todo", "in_progress", "in_review", "complete"),
      defaultValue: "todo",
    },
    tags: {
      type: DataTypes.STRING(),
    },
    picture: {
      type: DataTypes.STRING(100),
    },
    payment: {
      type: DataTypes.INTEGER,
      // allowNull: false,
    },
    deadline: {
      type: DataTypes.DATEONLY,
    },
    dao_id: {
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
console.log(Task === sequelize.models.Task, "Task REAL");

Dao.hasMany(Task, {
  foreignKey: "dao_id",
  as: "tasks",
});

// (async () => {
//   await sequelize.sync({ alter: true });
// })();

module.exports = Task;
