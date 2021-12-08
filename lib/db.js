const Sequelize = require("sequelize");

const connexion = new Sequelize(
  "mysql://root@localhost:3306/nodeBlog"
);

connection.authenticate().then(() => console.log("Database connected"));

module.exports = connexion;
