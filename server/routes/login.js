const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')


app.post('/login', (req, res) => {
    let body = req.body;

    User.findOne({
        email: body.email
    }, (err, user) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!res) {
            return res.status(404).json({
                ok: false,
                message: 'User and password are wrong'
            })
        }

        // Verify if both password matches
        if (!bcrypt.compareSync(body.password, user.password)) {
            return res.status(404).json({
                ok: false,
                message: 'User and password are wrong'
            })
        }

        let token = jwt.sign({
            user,
        }, process.env.TOKEN_SEED_SIGNATURE, {
            expiresIn: process.env.TOKEN_EXPIRATION
        })

        res.json({
            ok: true,
            user,
            token
        })

    })
})


module.exports = app;