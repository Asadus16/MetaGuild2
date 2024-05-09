const Sequelize = require("sequelize");

const sequelize = new Sequelize(/* connection details */);

const ProjectMember = sequelize.define("ProjectMember", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  project_id: {
    type: Sequelize.INTEGER,
    references: {
      model: "Project",
      key: "id",
    },
  },
  user_id: {
    type: Sequelize.INTEGER,
    references: {
      model: "User",
      key: "id",
    },
  },
});

module.exports = ProjectMember;
