const { Router } = require("express");
const { createToken } = require("../lib/jwt");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const router = Router();

router.post("/login", (req, res) => {
    User.findOne({where: 
        {
            email: req.body.email
        }
    }).then((user) => {
        if (user)
        {
            if (bcrypt.compareSync(req.body.password, user.password))
            {
                res.json({
                    id: user.id,
                    lastname: user.lastname,
                    firstname: user.firstname,
                    email: user.email,
                    token: createToken(user)
                });
            }
            else 
            {
                res.status(400).json({
                    token: null,
                    password: "Invalid credentials"
                });
            }
        }
        else 
        {
            res.status(400).json({
                token: null,
                email: "Email not found"
            });
        }
    }).catch(err => console.log(err));
});

module.exports = router;