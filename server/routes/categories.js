const express = require('express')
const app = express()
const _ = require('underscore')
const Category = require('../models/category')
const { verifyToken, verifyAdminRole } = require('../middlewares/auth')


app.get('/categories', verifyToken, (req, res) => {

    Category.find({})
        .sort('description')
        .populate('creatorUser', 'name email')
        .exec((err, categories) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Category.countDocuments({}, (err, count) => {
                res.json({
                    ok: true,
                    total: count,
                    categories
                })
            })
        })
})

app.get('/categories/:id', verifyToken, (req, res) => {

    Category.findById(req.params.id)
        .populate('creatorUser', 'name email')
        .exec((err, category) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,                
                category
            })

        })
})

app.post('/categories', verifyToken, (req, res) => {
    let body = req.body

    let category = new Category({
        description: body.description,
        creatorUser: req.user._id
    })

    category.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "An error has occurred"
                }
            })
        }

        res.status(201).json({
            ok: true,
            category: categoryDB
        })
    })
})

app.put('/categories/:id', verifyToken, (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['description'])
    let options = {
        new: true,
        runValidators: true,
        context: 'query'
    }

    Category.findByIdAndUpdate(id, body, options, (err, categoryDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "An error has occurred"
                }
            })
        }

        res.json({
            ok: true,
            category: categoryDB
        })
    })
})

app.delete('/categories/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id

    Category.findByIdAndDelete(id, (err, categoryDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoryDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: "Category not found"
                }
            })
        }

        res.json({
            ok: true,
            message: "Deleted successfully"
        })
    })

})


module.exports = app