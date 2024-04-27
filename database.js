const { Sequelize } = require('sequelize');

// Option 2: Passing parameters separately (sqlite)

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('meta_guild', 'postgres', '1234', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
});
module.exports = sequelize;
