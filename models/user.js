const { Model, DataTypes } = require("sequelize");
const connexion = require("../lib/db");
const bcrypt = require("bcryptjs");

class User extends Model {}

User.init(
    {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        lastname: { type: DataTypes.STRING, allowNull: false },
        firstname: { type: DataTypes.STRING, allowNull: false },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                notNull: { args: true, msg: "You must enter a name" }
            }
        },
        password: { type: DataTypes.STRING, allowNull: false },
        articles: { type: DataTypes.STRING },
        createdAt: { type: DataTypes.DATE, allowNull: false },
        updatedAt: { type: DataTypes.DATE, allowNull: false },
        isAdmin: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    {
        sequelize: connexion,
        modelName: "User",
        scopes: {
            noPwd: {
              attributes: { exclude: ['password'] },
            }
          }
    }
);

function encodePassword(user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
}

User.addHook("beforeCreate", encodePassword);
User.addHook("beforeUpdate", encodePassword);

module.exports = User;