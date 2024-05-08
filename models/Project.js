const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../database");
var bcrypt = require("bcryptjs");

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
    first_name: {
      type: DataTypes.STRING(100),
    },
    last_name: {
      type: DataTypes.STRING(100),
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

(async () => {
  await sequelize.sync({ alter: true });
  // Code here
})();

module.exports = Project;
