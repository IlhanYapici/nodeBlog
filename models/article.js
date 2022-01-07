const { Model, DataTypes } = require("sequelize");
const connection = require("../lib/db");

class Article extends Model {}

Article.init(
    {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        title: { type: DataTypes.STRING, allowNull: false },
        content: { type: DataTypes.STRING, allowNull: false },
        tags: { type: DataTypes.STRING, 
            validate: {
                is: /^[a-z]+(-[a-z]+)*$/
            }, allowNull: false
        },
        authorId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        createdAt: { type: DataTypes.DATE, allowNull: false },
        updatedAt: { type: DataTypes.DATE, allowNull: false },
        deletedAt: { type: DataTypes.DATE },
    },
    {
        sequelize: connection,
        paranoid: true,
        modelName: "Article",
        defaultScope: {
            attributes: { exclude: ['deletedAt'] }
        }
    }
);

module.exports = Article;