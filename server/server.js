require('./config/config')

const express = require('express')
const mongoose = require('mongoose');
const app = express()

// parse application/json
app.use(express.json())

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

app.use(require('./routes/users'))

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