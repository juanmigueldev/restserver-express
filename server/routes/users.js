const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const _ = require('underscore')


app.get('/users', (req, res) => {

    let from = req.query.from || 0
    from = Number(from)
    let page = req.query.limit || 5
    page = Number(page)

    User.find({active: true})
        .select('name email role google')
        .skip(from)
        .limit(page)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            User.count({ active:true }, (err, count) => {
                res.json({
                    ok: true,
                    total: count,
                    users
                })
            })
        })
})

app.post('/users', (req, res) => {
    let body = req.body

    // creates a new instace of User schema
    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    user.save((err, userdb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            user: userdb
        })
    })
})

app.put('/users/:id', (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['name', 'email', 'image', 'role', 'active'])
    let options = {
        new: true,
        runValidators: true,
        context: 'query'
    }

    User.findByIdAndUpdate(id, body, options, (err, userdb) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            user: userdb
        })
    })
})

app.delete('/users/:id', (req, res) => {
    let id = req.params.id

    User.findByIdAndUpdate(id, { active : false}, {new: true}, (err, userdb) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            user: userdb
        })
    })

})

module.exports = app