const { Router } = require("express");
const verifyWebToken = require("../middlewares/verifyWebToken");
const User = require("../models/user");
const Article = require("../models/article");
const router = Router();

router.get("", verifyWebToken, (req, res) => {
    const id = parseInt(req.user.id)
    const Query = req.query
    let articlesArr = [];
    if (!req.user.isAdmin) {
        User.scope('noPwd').findByPk(id)
        .then(user => {
            if (!user) return res.sendStatus(404);
            else {
                Article.findAll({
                    limit: 2,
                    order: [['updatedAt', 'DESC']],
                    where: {
                        authorId: user.id
                    }
                })
                .then(articles => {
                    for(let i = 0; i < articles.length; i++) {
                        articlesArr[i] = articles[i].dataValues.title;
                    }
                    user.articles = articlesArr;
                    res.json(user);
                })
                .catch(err => console.error(err))
            }
        })
        .catch(err => console.error(err));
    }
    else {
        User.scope('noPwd').findAll({
            where: Query
        }).then(async users => {
            let userId;
            for(let i = 0; i < users.length; i++) {
                userId = parseInt(users[i].dataValues.id)
                await Article.findAll({
                    limit: 2,
                    order: [['updatedAt', 'DESC']],
                    where: {
                        authorId: userId
                    }
                })
                .then(articles => {
                    for(let j = 0; j < articles.length; j++) {
                        articlesArr[j] = articles[j].dataValues.title
                    }
                    users[i].dataValues.articles = articlesArr;
                    articlesArr = [];
                })
                .catch(err => console.error(err));
            }
            res.json(users)
        }).catch(err => console.error(err))
    }
});

router.post("", (req, res) => {
    if (req.body.isAdmin) return res.status(401).json({isAdmin: "You can't change that parameters"})
    else {
        User.create(req.body)
        .then((user) => res.sendStatus(201))
        .catch(err => console.error(`User.post: ${err}`));
    }
});

router.get("/:id", verifyWebToken, (req, res) => {
    const id = parseInt(req.params.id);
    let articlesArr = [];
    if (!req.user.isAdmin) {
        if (req.user.id !== id) return res.sendStatus(401);

        else if (req.user.id === id) {
            User.scope('noPwd').findByPk(id)
            .then(async (user) => {
                if (!user) return res.sendStatus(404);
                else {
                    await Article.findAll({
                        limit: 2,
                        order: [['updatedAt', 'DESC']],
                        where: {
                            authorId: user.id
                        }
                    })
                    .then(articles => {
                        for(let i = 0; i < articles.length; i++) {
                            articlesArr[i] = articles[i].dataValues.title;
                        }
                        user.articles = articlesArr;
                        res.json(user);
                    })
                    .catch(err => console.error(err));
                }
            })
            .catch(err => console.error(err));
        }
    }
    else {
        User.scope('noPwd').findByPk(id)
        .then((user) => {
            if (!user) return res.sendStatus(404);
            else {
                Article.findAll({
                    limit: 2,
                    order: [['updatedAt', 'DESC']],
                    where: {
                        authorId: user.id
                    }
                })
                .then(articles => {
                    for(let i = 0; i < articles.length; i++) {
                        articlesArr[i] = articles[i].dataValues.title;
                    }
                    user.articles = articlesArr;
                    res.json(user);
                })
                .catch(err => console.error(err))
            }
        })
        .catch(err => console.error(err));
    }
});

router.delete("/:id", verifyWebToken, (req, res) => {
    const id = parseInt(req.params.id);
    if (!req.user.isAdmin) {
        if (req.user.id !== id) return res.sendStatus(401);

        else if (req.user.id === id) {
            User.destroy({
                where: {
                    id: id
                }
            })
            .then((isDeleted => {
                if (!isDeleted) return res.sendStatus(404);
                else res.sendStatus(204);
            }))
            .catch(err => console.error(err));
        }
    }
    else {
        User.destroy({
            where: {
                id: id
            }
        })
        .then((isDeleted => {
            if (!isDeleted) return res.sendStatus(404);
            else res.sendStatus(204);
        }))
        .catch(err => console.error(err));
    }
});

router.put("/:id", verifyWebToken, (req, res) => {
    const id = parseInt(req.params.id);

    if (req.body.email !== undefined && !req.body.email.includes('@')){
        return res.status(400).json({email: "invalid email"});
    }
    if (req.body.isAdmin) return res.status(401).json({isAdmin: "You can't update that field"});

    if (!req.user.isAdmin) {
        if (req.user.id !== id) return res.sendStatus(401);

        else if (req.user.id === id) {
            User.update(req.body, {
                where: {
                    id: id
                },
                individualHooks: true
            }).then(([isUpdated]) => {
                if (!isUpdated) return res.sendStatus(404);
                else User.findByPk(id, { attributes: { exclude: ['password'] } }).then((user) => res.json(user));
            });
        }
    }
    else {
        User.update(req.body, {
            where: {
                id: id
            },
            individualHooks: true
        }).then(([isUpdated]) => {
            if (!isUpdated) return res.sendStatus(404);
            else User.findByPk(id, { attributes: { exclude: ['password'] } }).then((user) => res.json(user));
        });
    }
});

module.exports = router;