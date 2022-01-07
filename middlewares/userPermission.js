const Article = require('../models/article');
const Comment = require('../models/comment');

/**
 * @param {Object} user - User object of the request.
 * @param {string} model - The model to check. Article or Comment.
 * @param {number} id - The id of the model.
 */

function userPermission(user, model, id, res) {
    switch(model) {
        case "article":
            Article.findByPk(id).then(article => {
                if (!article) return res.sendStatus(404);
                else return (user.isAdmin === true || article.authorId === user.id);
            });
        
        case "comment":
            Comment.findByPk(id).then(comment => {
                if (!comment) return res.sendStatus(404);
                else return (user.isAdmin === true || comment.authorId === user.id);
            });
    }
}

module.exports = {
    userPermission
}