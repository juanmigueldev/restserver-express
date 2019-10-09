require('./config/config')

const express = require('express')
const mongoose = require('mongoose');
const path = require('path')
const app = express()
const hbs = require('hbs')

// parse application/json
app.use(express.json())

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))


// Enable public forder
// app.use(express.static(path.resolve(__dirname, '../public')))

// Express HBS template engine
app.set('view engine', 'hbs')

// global routes config 
app.use(require('./routes/index'))

app.get('/', (req, res) => {
  res.render('home', {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  })
})


// mongoose connect
mongoose.connect(
  process.env.dbUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log("Successfully connection to DB"))
  .catch((err) => console.log(err))


app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
})