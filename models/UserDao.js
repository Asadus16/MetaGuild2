const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../database");
const Dao = require("./Dao");
const User = require("./User");

const UserDao = sequelize.define(
  "UserDao",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role: {
      type: DataTypes.ENUM("admin", "member"),
      allowNull: false,
    },
    dao_id: {
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
    modelName: "UserDao",
    tableName: "user_dao",
    indexes: [{ unique: true, fields: ["id"] }],
  }
);

console.log(UserDao === sequelize.models.UserDao, "USERDAO REAL");

Dao.belongsToMany(User, { through: UserDao, foreignKey: "dao_id" });
User.belongsToMany(Dao, { through: UserDao, foreignKey: "user_id" });

UserDao.belongsTo(User, { foreignKey: "user_id" });

// (async () => {
//   await sequelize.sync({ alter: true });
// })();

module.exports = UserDao;
