const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../database");
var bcrypt = require("bcryptjs");
const Task = require("./Task");
const User = require("./User");

class Project extends Model {}

Project.init(
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
    roles: {
      type: DataTypes.ENUM("member", "admin", "co_admin"),
      defaultValue: "member",
    },
    name: {
      type: DataTypes.STRING(100),
    },
    description: {
      type: DataTypes.STRING(100),
    },
    picture: {
      type: DataTypes.STRING(100),
    },
    account_status: {
      type: DataTypes.ENUM("active", "inactive", "suspended"),
      defaultValue: "active",
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "Project", // We need to choose the model name
    tableName: "projects",
    timestamps: true,
    indexes: [{ unique: true, fields: ["id"] }],
  }
);

// the defined model is the class itself
console.log(Project === sequelize.models.Project); // true

Project.hasMany(Task, {
  foreignKey: "project_id",
  onUpdate: "CASCADE",
  onDelete: "SET NULL",
  as: "tasks",
});
// Project.hasMany(User, {
//   foreignKey: "project_id",
//   onUpdate: "CASCADE",
//   onDelete: "SET NULL",
//   as: "users",
// });
Task.belongsTo(Project, { foreignKey: "project_id" });

(async () => {
  await sequelize.sync({ alter: true });
})();

module.exports = Project;
