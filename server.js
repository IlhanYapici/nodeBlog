const express = require("express");
const securityRouter = require("./routes/security");
const userRouter = require("./routes/user");
const articleRouter = require("./routes/article");
const verifyWebToken = require("./middlewares/verifyWebToken");
const app = express();

const connection = require("./lib/db");
connection.sync();

app.use(express.json());

app.use("", securityRouter);
app.use("/users", userRouter);
app.use("/articles", verifyWebToken, articleRouter);

app.listen(3000, () => console.log("Server is listening."));