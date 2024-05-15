const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../database");
var bcrypt = require("bcryptjs");
const Dao = require("./Dao");
// const UserDao = require("./UserDao");

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    contract_address: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    ens_address: {
      type: DataTypes.STRING(100),
      unique: true,
    },
    role: {
      type: DataTypes.ENUM("member", "admin", "co_admin"),
      defaultValue: "member",
    },
    name: {
      type: DataTypes.STRING(100),
    },
    // email: {
    //   type: DataTypes.STRING(100),
    //   unique: true,
    // },
    // password: {
    //   type: DataTypes.STRING(128),
    //   set(value) {
    //     var salt = bcrypt.genSaltSync(8);
    //     var hash = bcrypt.hashSync(value, salt);
    //     this.setDataValue("password", hash);
    //   },
    // },
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
    modelName: "User", // We need to choose the model name
    tableName: "users",
    timestamps: true,
    indexes: [{ unique: true, fields: ["id"] }],
  }
);

console.log(User === sequelize.models.User, "USER REAL"); // true

// User.belongsToMany(Dao, { through: UserDao, foreignKey: "user_id" });
// User.hasMany(Task, {
//   foreignKey: "user_id",
//   onUpdate: "CASCADE",
//   onDelete: "SET NULL",
//   as: "tasks",
// });
// Task.belongsTo(User, { foreignKey: "user_id" });

// (async () => {
//   await sequelize.sync({ alter: true });
// })();

module.exports = User;
