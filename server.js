const express = require("express");
const app = express();

// - - - - - //
// Code here //
// - - - - - //

app.use(express.json());
app.listen(3000, () => console.log("Server is listening."))