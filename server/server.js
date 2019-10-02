require('../config/config')

const express = require('express')
const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.get('/users', (req, res) => {
    res.json('get user')
})

app.post('/users', (req, res) => {
    let body = req.body
    
    if(!body.name){
        res.status(400).json({
            ok: false,
            message: 'Name is required'
        })
    }else{
        res.json({
            body
        })
    } 
})

app.put('/users/:id', (req, res) => {
    let id = req.params.id

    res.json({
        id,
        user: 'test'
    })
})

app.delete('/users', (req, res) => {
    res.json('delete user')
})

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT }`);
})