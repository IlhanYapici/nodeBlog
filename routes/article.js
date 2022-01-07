const { Router } = require("express");
const Article = require("../models/article");
const Comment = require("../models/comment");
const User = require("../models/user");
const { userPermission } = require("../middlewares/userPermission");
const router = Router();

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

router.post("/:id/comments", (req, res) => {
    const id = parseInt(req.params.id);
    Article.findByPk(id)
    .then(article => {
        if (!article) return res.sendStatus(404);
        else {
            req.body.authorId = req.user.id;
            req.body.articleId = id;
            req.body.author = `${capitalize(req.user.lastname)} ${capitalize(req.user.firstname)}`;
            req.body.article = article.title;
            Comment.create(req.body).then((comment) => res.status(201).json(comment));
        }
    })
    .catch(err => console.error(err));
});

router.get("/:id/comments", (req, res) => {
    const id = parseInt(req.params.id);
    Article.findByPk(id)
    .then(article => {
        if (!article) return res.sendStatus(404);
        else {
            Comment.findAll({
                where: {
                    article: article.title
                }
            }).then(comments => res.json(comments));
        }
    })
    .catch(err => console.error(err));
});

router.get("/comments/:id", (req, res) => {
    const id = req.params.id;
    Comment.findByPk(id).then(async comment => {
        userId = comment.dataValues.authorId;
        await User.findByPk(userId)
        .then(user => {
            let author = `${capitalize(user.lastname)} ${capitalize(user.firstname)}`;
            comment.dataValues.author = author;
            res.status(200).json(comment);
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
});

router.put("/comments/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (req.user.isAdmin === false) {
        await Comment.findByPk(id)
        .then(article => {
            if (!article) return res.sendStatus(401);
            else if (article.authorId === req.user.id) {
                Comment.update(req.body, {
                    where: {
                        id: id
                    }
                })
                .then(([isUpdated]) => {
                    if (!isUpdated) res.sendStatus(404);
                    else Comment.findByPk(id).then((article) => res.json(article));
                })
                .catch(err => console.error(err));
            }
            else res.sendStatus(401);
        })
        .catch(err => console.error(err));
    }
    else {
        Comment.update(req.body, {
            where: {
                id: id
            }
        })
        .then(([isUpdated]) => {
            if (!isUpdated) res.sendStatus(404);
            else Comment.findByPk(id).then((comment) => res.json(comment));
        })
        .catch(err => console.error(err));
    }
});

router.delete("/comments/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (req.user.isAdmin === false) {
        await Comment.findByPk(id)
        .then(article => {
            if (!article) return res.sendStatus(401);
            else if (article.authorId === req.user.id) {
                Comment.destroy({
                    where: {
                        id: id
                    }
                })
                .then((isDeleted) => {
                    if (!isDeleted) return res.sendStatus(404);
                    else return res.sendStatus(204);
                })
                .catch(err => console.error(err));
            }
            else res.sendStatus(401);
        })
        .catch(err => console.error(err));
    }
    else {
        Comment.destroy({
            where: {
                id: id
            }
        })
        .then((isDeleted) => {
            if (!isDeleted) return res.sendStatus(404);
            else res.sendStatus(204);
        })
        .catch(err => console.error(err));
    }
});

router.get("/comments", (req, res) => {
    const Query = req.query;
    if (!req.headers["authorid"] && !req.headers["articleid"]) {
        Comment.findAll({
            where: Query
        })
        .then(async (comments) => {
            if (!comments || comments.length === 0) return res.sendStatus(404);
            else {
                let userId;
                for(let i = 0; i < comments.length; i++) {
                    userId = comments[i].dataValues.authorId;
                    await User.findByPk(userId)
                    .then(user => {
                        let author = `${capitalize(user.lastname)} ${capitalize(user.firstname)}`;
                        comments[i].dataValues.author = author;
                    })
                    .catch(err => console.error(err));
                }
                res.status(200).json(comments)
            }
        })
        .catch(err => console.error(err));
    }
    else if (req.headers["authorid"] && !req.headers["articleid"]) {
        const authorId = req.headers["authorid"];
        Comment.findAll({
            where: {
                authorId: authorId
            }
        })
        .then(async (comments) => {
            if (!comments || comments.length === 0) return res.sendStatus(404);
            else {
                let userId;
                for(let i = 0; i < comments.length; i++) {
                    userId = comments[i].dataValues.authorId;
                    await User.findByPk(userId)
                    .then(user => {
                        let author = `${capitalize(user.lastname)} ${capitalize(user.firstname)}`;
                        comments[i].dataValues.author = author;
                    })
                    .catch(err => console.error(err));
                }
                res.status(200).json(comments)
            }
        })
        .catch(err => console.error(err));
    }
    else if (!req.headers["authorid"] && req.headers["articleid"]) {
        const articleId = req.headers["articleid"];
        Comment.findAll({
            where: {
                articleId: articleId
            }
        })
        .then(async (comments) => {
            if (!comments || comments.length === 0) return res.sendStatus(404);
            else {
                let userId;
                for(let i = 0; i < comments.length; i++) {
                    userId = comments[i].dataValues.authorId;
                    await User.findByPk(userId)
                    .then(user => {
                        let author = `${capitalize(user.lastname)} ${capitalize(user.firstname)}`;
                        comments[i].dataValues.author = author;
                    })
                    .catch(err => console.error(err));
                }
                res.status(200).json(comments)
            }
        })
        .catch(err => console.error(err));
    }
    else {
        const authorId = req.headers["authorid"];
        const articleId = req.headers["articleid"];
        Comment.findAll({
            where: {
                authorId: authorId,
                articleId: articleId
            }
        })
        .then(async (comments) => {
            if (!comments || comments.length === 0) return res.sendStatus(404);
            else {
                let userId;
                for(let i = 0; i < comments.length; i++) {
                    userId = comments[i].dataValues.authorId;
                    await User.findByPk(userId)
                    .then(user => {
                        let author = `${capitalize(user.lastname)} ${capitalize(user.firstname)}`;
                        comments[i].dataValues.author = author;
                    })
                    .catch(err => console.error(err));
                }
                res.status(200).json(comments)
            }
        })
        .catch(err => console.error(err));
    }
    
});

router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    Article.findByPk(id)
    .then(async (article) => {
        if (!article) res.sendStatus(404);
        else {
            await User.findByPk(article.authorId)
            .then((user) => {
                if (!user) return res.sendStatus(404);
                else {
                    let author = `${capitalize(user.lastname)} ${capitalize(user.firstname)}`
                    article.dataValues.author = author;
                    res.status(200).json(article)
                }
            })
            .catch(err => console.error(err));
        }
    })
    .catch(err => console.error(err));
});

router.put("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (req.user.isAdmin === false) {
        await Article.findByPk(id)
        .then(article => {
            if (!article) return res.sendStatus(401);
            else if (article.authorId === req.user.id) {
                Article.update(req.body, {
                    where: {
                        id: id
                    }
                })
                .then(([isUpdated]) => {
                    if (!isUpdated) res.sendStatus(404);
                    else Article.findByPk(id).then((article) => res.json(article));
                })
                .catch(err => console.error(err));
            }
            else res.sendStatus(401);
        })
        .catch(err => console.error(err));
    }
    else {
        Article.update(req.body, {
            where: {
                id: id
            }
        })
        .then(([isUpdated]) => {
            if (!isUpdated) res.sendStatus(404);
            else Article.findByPk(id).then((article) => res.json(article));
        })
        .catch(err => console.error(err));
    }
})

router.delete("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if(req.user.isAdmin === false) {
        await Article.findByPk(id)
        .then(article => {
            if (!article) return res.sendStatus(401);
            else if (article.authorId === req.user.id) {
                Article.destroy({
                    where: {
                        id: id
                    }
                })
                .then((isDeleted) => {
                    if (!isDeleted) return res.sendStatus(404);
                    else return res.sendStatus(204);
                })
                .catch(err => console.error(err));
            }
            else res.sendStatus(401);
        })
        .catch(err => console.error(err));
    }
    else {
        Article.destroy({
            where: {
                id: id
            }
        })
        .then((isDeleted) => {
            if (!isDeleted) return res.sendStatus(404);
            else return res.sendStatus(204);
        })
        .catch(err => console.error(err));
    }
});

router.get("", (req, res) => {
    if (!req.headers["title"] && !req.headers["tags"]) {
        const Query = req.query;
        Article.findAll({
            where: Query
        })
        .then(async (articles) => {
            if (!articles) return res.sendStatus(404)
            else {
                let userId;
                for(let i = 0; i < articles.length; i++) {
                    userId = articles[i].dataValues.authorId;
                    await User.findByPk(userId)
                    .then(user => {
                        let author = `${capitalize(user.lastname)} ${capitalize(user.firstname)}`;
                        articles[i].dataValues.author = author;
                    })
                    .catch(err => console.error(err));
                }
                res.status(200).json(articles)
            }
        })
        .catch(err => console.error(err));
    }
    else if (req.headers["title"] && !req.headers["tags"]) {
        const title = req.headers["title"];
        Article.findAll({
            where: {
                title: title
            }
        })
        .then(async (articles) => {
            if (!articles) return res.sendStatus(404)
            else {
                let userId;
                for(let i = 0; i < articles.length; i++) {
                    userId = articles[i].dataValues.authorId;
                    await User.findByPk(userId)
                    .then(user => {
                        let author = `${capitalize(user.lastname)} ${capitalize(user.firstname)}`;
                        articles[i].dataValues.author = author;
                    })
                    .catch(err => console.error(err));
                }
                res.status(200).json(articles)
            }
        })
        .catch(err => console.error(err));
    }
    else if (!req.headers["title"] && req.headers["tags"]) {
        const tags = req.headers["tags"];
        Article.findAll({
            where: {
                tags: tags
            }
        })
        .then(async (articles) => {
            if (!articles) return res.sendStatus(404)
            else {
                let userId;
                for(let i = 0; i < articles.length; i++) {
                    userId = articles[i].dataValues.authorId;
                    await User.findByPk(userId)
                    .then(user => {
                        let author = `${capitalize(user.lastname)} ${capitalize(user.firstname)}`;
                        articles[i].dataValues.author = author;
                    })
                    .catch(err => console.error(err));
                }
                res.status(200).json(articles)
            }
        })
        .catch(err => console.error(err));
    }
    else {
        const title = req.headers["title"];
        const tags = req.headers["tags"];
        Article.findAll({
            where: {
                title: title,
                tags: tags
            }
        })
        .then(async (articles) => {
            if (!articles) return res.sendStatus(404)
            else {
                let userId;
                for(let i = 0; i < articles.length; i++) {
                    userId = articles[i].dataValues.authorId;
                    await User.findByPk(userId)
                    .then(user => {
                        let author = `${capitalize(user.lastname)} ${capitalize(user.firstname)}`;
                        articles[i].dataValues.author = author;
                    })
                    .catch(err => console.error(err));
                }
                res.status(200).json(articles)
            }
        })
        .catch(err => console.error(err));
    }
});

router.post("", (req, res) => {
    req.body.authorId = req.user.id;
    Article.create(req.body)
    .then((article) => res.status(201).json(article))
    .catch(err => console.error(err));
});

module.exports = router;