const express = require("express");
const securityRouter = require("./routes/security");
const userRouter = require("./routes/user");
const articleRouter = require("./routes/article");
const verifyWebToken = require("./middleware/verifyWebToken");
const app = express();

const connection = require("./lib/db");
connection.sync();

app.use(express.json());

// Le router 'comment' est intégré dans le router 'articleRouter'
// Pour lister tous les commentaires de tous les articles, il faut GET sur /articles/comments
// Pour lister tous les commentaires d'un article, il faut GET sur /articles/:id/comments
// Pour lister un commentaire précis, il faut GET sur /articles/comments/:id

// Un commentaire est forcément lié à un article, donc pour poster un commentaire
// il faut POST sur /articles/:id/comments

app.use("", securityRouter);
app.use("/users", userRouter);
app.use("/articles", verifyWebToken, articleRouter);

app.listen(3000, () => console.log("Server is listening."));