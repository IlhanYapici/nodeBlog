const Sequelize = require("sequelize");

const connection = new Sequelize(
  "mysql://root@localhost:3306/test_blog", {
    dialect: 'mysql',
    logging: false,
    timezone: '+01:00'
  }
);

connection.authenticate().then(() => console.log("Database connected."));

module.exports = connection;
