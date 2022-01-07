const { Model, DataTypes } = require("sequelize");
const connection = require("../lib/db");

class Comment extends Model {}

Comment.init(
    {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        content: { type: DataTypes.STRING, allowNull: false },
        authorId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        articleId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: 'articles',
                key: 'id'
            }
        },
        article: { type: DataTypes.STRING, allowNull: false },
        createdAt: { type: DataTypes.DATE, allowNull: false },
        updatedAt: { type: DataTypes.DATE, allowNull: false },
        deletedAt: { type: DataTypes.DATE, defaultValue: null },
    },
    {
        sequelize: connection,
        paranoid: true,
        modelName: "Comment",
        defaultScope: {
            attributes: { exclude: ['deletedAt'] }
        }
    }
);

module.exports = Comment;