const { Sequelize, DataTypes, Model } = require("sequelize");

const sequelize = require("../database");
const User = require("./User");
const Task = require("./Task");

const TaskUser = sequelize.define(
  "TaskUser",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role: {
      type: DataTypes.ENUM("admin", "contributor"),
      allowNull: false,
    },
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "TaskUser",
    tableName: "task_users",
    indexes: [{ unique: true, fields: ["id"] }],
  }
);

console.log(TaskUser === sequelize.models.TaskUser, "TaskUser REAL"); // true

User.belongsToMany(Task, { through: TaskUser, foreignKey: "user_id" });
Task.belongsToMany(User, { through: TaskUser, foreignKey: "task_id" });

// (async () => {
//   await sequelize.sync({ alter: true });
// })();

module.exports = TaskUser;
