const express = require('express')
const app = express()
const _ = require('underscore')
const Product = require('../models/product')
const AuthMiddleWare = require('../middlewares/auth')




app.get('/products/search/:query', AuthMiddleWare.verifyToken, (req, res) => {

    let query = req.params.query;
    let regex = new RegExp(query, 'i')

    Product.find({ name: regex})
        .populate('category','description')
        .populate('creatorUser', 'name email image')
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                message: !products ? `Not results found for '${req.param.query}'` : `${products.length} products found`,
                products
            })
        })
})

app.get('/products', AuthMiddleWare.verifyToken, (req, res) => {

    let from = req.query.from || 0
    from = Number(from)
    let pagesize = req.query.pagesize || 5
    pagesize = Number(pagesize)

    Product.find({available: true})
        .sort('name')
        .skip(from)
        .limit(pagesize)
        .populate('category', 'description')
        .populate('creatorUser', 'name email image')
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Product.countDocuments({available: true}, (err, count) => {
                res.json({
                    ok: true,
                    total: count,
                    products
                })
            })
        })
})

app.get('/products/:id', AuthMiddleWare.verifyToken, (req, res) => {

    Product.findById(req.params.id)
        .populate('category','description')
        .populate('creatorUser', 'name email image')
        .exec((err, product) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!product) {
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: "Product not found"
                    }
                })
            }

            res.json({
                ok: true,
                product
            })
        })
})

app.post('/products', AuthMiddleWare.verifyToken, (req, res) => {
    let body = req.body

    let product = new Product({
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        category: body.category,
        creatorUser: req.user._id        
    })

    product.save((err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "An error has occurred"
                }
            })
        }

        res.status(201).json({
            ok: true,
            product: productDB
        })
    })
})

app.put('/products/:id', AuthMiddleWare.verifyToken, (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['name', 'description', 'unitPrice'])
    let options = {
        new: true,
        runValidators: true,
        context: 'query'
    }

    Product.findByIdAndUpdate(id, body, options, (err, productDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "An error has occurred"
                }
            })
        }

        res.json({
            ok: true,
            product: productDB
        })
    })
})

app.delete('/products/:id', [AuthMiddleWare.verifyToken, AuthMiddleWare.verifyAdminRole], (req, res) => {
    let id = req.params.id

    Product.findByIdAndUpdate(id, { available : false}, {new: true}, (err, productDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productDB) {
            return res.status(404).json({
                ok: false,
                err:{
                    message: "Product not found"
                }
            })
        }

        res.json({
            ok: true,
            message: "Product was deleted"
        })
    })

})


module.exports = app