const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const _ = require('underscore')
const User = require('../models/user')
const { verifyToken, verifyAdminRole } = require('../middlewares/auth')


app.get('/users',  verifyToken, (req, res) => {

    let from = req.query.from || 0
    from = Number(from)
    let page = req.query.limit || 5
    page = Number(page)

    User.find({active: true})
        .select('name email role google image')
        .skip(from)
        .limit(page)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            User.countDocuments({ active:true }, (err, count) => {
                res.json({
                    ok: true,
                    total: count,
                    users
                })
            })
        })
})

app.post('/users', [verifyToken, verifyAdminRole], (req, res) => {
    let body = req.body

    // creates a new instace of User schema
    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    user.save((err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.status(201).json({
            ok: true,
            user: userDB
        })
    })
})

app.put('/users/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['name', 'email', 'image', 'role', 'active'])
    let options = {
        new: true,
        runValidators: true,
        context: 'query'
    }

    User.findByIdAndUpdate(id, body, options, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            user: userDB
        })
    })
})

app.delete('/users/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id

    User.findByIdAndUpdate(id, { active : false}, {new: true}, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            user: userDB
        })
    })

})

module.exports = app