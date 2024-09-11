
const { Sequelize } = require('sequelize');
const config = require('config');

const dbConfig = config.get('db');

const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  logging: false,  
});

sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch((err) => console.error('Error syncing the database:', err));

module.exports = sequelize;
