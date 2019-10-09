const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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


//==========================
// GOOGLE SIGN IN
//==========================
const verifyGoogleToken = async (token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()

    return {
        name: payload.name,
        email: payload.email,
        image: payload.picture,
        google: true
    }
}



app.post('/google', async (req, res) => {

    let token = req.body.id_token
    let googleUser;
    
    try {
        googleUser = await verifyGoogleToken(token)        
    } catch (error) {
        return res.status(403).json({
            ok: false,
            err: {
                message: 'Invalid token'
            }
        })
    }

    User.findOne({ email: googleUser.email }, (err, user) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (user) {

            // Already registered without google
            if (!user.google) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'You are registered. Login with normal authentication.'
                    }
                })
            }else {
                // Already registered with google, return token.
                let token = jwt.sign({
                    user,
                }, process.env.TOKEN_SEED_SIGNATURE, { expiresIn: process.env.TOKEN_EXPIRATION })

                res.json({
                    ok: true,
                    user,
                    token
                })
            }
        }
        else {

            let user = new User({
                name: googleUser.name,
                email: googleUser.email,                
                google: googleUser.google,
                password: 'google'
            })

            user.save((err, userdb) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                // after user creation, no is used jtw for log in and return token
                let token = jwt.sign({
                    user,
                }, process.env.TOKEN_SEED_SIGNATURE, { expiresIn: process.env.TOKEN_EXPIRATION })

                res.json({
                    ok: true,
                    user,
                    token
                })
            })
        }
    })
})

module.exports = app;