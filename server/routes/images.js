const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()

// Middlewares
const AuthMiddleWare = require('../middlewares/auth')


app.get('/images/:type/:image', AuthMiddleWare.verifyToken, (req, res) => {

    let type = req.params.type
    let image = req.params.image

    let imagePath = path.resolve(__dirname, `../../uploads/${type}/${image}`)
    let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg')

    if(fs.existsSync(imagePath))
        res.sendFile(imagePath)
    else
        res.sendFile(noImagePath)
    
})

module.exports = app



