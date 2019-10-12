const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()
const fs = require('fs')
const path = require('path')


// Middlewares
const AuthMiddleWare = require('../middlewares/auth')

// Models
const User = require('../models/user')
const Product = require('../models/product')

// Middleware
app.use(fileUpload())

app.put('/upload/:type/:id', AuthMiddleWare.verifyToken, (req, res) => {

    let type = req.params.type
    let id = req.params.id

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "No files were uploaded."
            }
        })
    }

    let allowedTypes = ['products', 'users']

    if (allowedTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                value: type,
                message: `File type not are valid. Allowed types are ${allowedTypes.join(', ')}`
            }
        })
    }

    // The name of the input file used to retrieve the uploaded file
    let file = req.files.file

    // Allowed extensions
    let allowedExtensions = ['png', 'jpg', 'jpeg', 'gif']
    let filename = file.name.split('.')
    let fileExtension = filename[filename.length - 1]

    if (allowedExtensions.indexOf(fileExtension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                value: fileExtension,
                message: `File extension not are valid. Allowed extensions are ${allowedExtensions.join(', ')}`
            }
        })
    }

    let fileName = `${id}-${new Date().getMilliseconds()}.${fileExtension}`

    file.mv(`./uploads/${type}/${fileName}`)
        .then(response => {

            if (type === "users")
                loadUserImage(id, type, fileName, res)
            else
                loadProductImage(id, type, fileName, res)
        })
        .catch(err => {
            console.log(err); // TODO: must be a logger
            res.status(500).json({
                ok: false,
                err: {
                    message: "Server error when try to upload file",
                }
            })
        })
})

const loadUserImage = (id, type, fileName, res) => {
    User.findById(id, (err, user) => {

        if (err) {
            console.log(err); // TODO: must be a logger
            // deletes the new image saved because the user could not be found
            deleteImage(type, fileName)
            return res.status(500).json({
                ok: false,
                err: {
                    message: "Server error when try to load file to user",
                }
            })
        }

        if (!user) {
            // deletes the new image saved because the user could not be found
            deleteImage(type, fileName)
            return res.status(404).json({
                ok: false,
                err: {
                    message: "User not found"
                }
            })
        }

        let oldImage = user.image
        user.image = fileName

        user.save()
            .then(response => {
                deleteImage(type, oldImage)
                res.status(200).json({
                    ok: true,
                    message: "File was uploaded successfully",
                    image: fileName
                })
            })
            .catch(err => {
                // deletes the new image saved because the reference could not be updated in the user
                deleteImage(type, fileName)
                res.status(500).json({
                    ok: false,
                    message: "Error on update user"
                })
            })
    })
}

const loadProductImage = (id, type, fileName, res) => {
    Product.findById(id, (err, product) => {

        if (err) {
            console.log(err); // TODO: must be a logger
            // deletes the new image saved because the product could not be found
            deleteImage(type, fileName)
            return res.status(500).json({
                ok: false,
                err: {
                    message: "Server error when try to load file to product",
                }
            })
        }

        if (!product) {
            // deletes the new image saved because the product could not be found
            deleteImage(type, fileName)
            return res.status(404).json({
                ok: false,
                err: {
                    message: "Product not found"
                }
            })
        }

        let oldImage = product.image
        product.image = fileName

        product.save()
            .then(response => {
                deleteImage(type, oldImage)
                res.status(200).json({
                    ok: true,
                    message: "File was uploaded successfully",
                    image: fileName
                })
            })
            .catch(err => {
                // deletes the new image saved because the reference could not be updated in the user
                deleteImage(type, fileName)
                res.status(500).json({
                    ok: false,
                    message: "Error on update product"
                })
            })
    })
}


const deleteImage = (type, image) => {
    let imagePath = path.resolve(__dirname, `../../uploads/${type}/${image}`)

    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
    }
}

module.exports = app