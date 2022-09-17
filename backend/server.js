const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport')
const config = require('./config/database')

// Connecting with mongo db
mongoose
  .connect(config.database)
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err.reason)
  })


// Setting up port with express js
const messageAppRoute = require('../backend/routes/message.route')

const app = express();
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
)

app.use(cors())

app.use(express.static(path.join(__dirname, 'dist/srdc-staj-3')))
app.use('/', express.static(path.join(__dirname, 'dist/srdc-staj-3')))

app.use('/api', messageAppRoute)


// Passport
app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport);



// Create port
const port = process.env.PORT || 4000
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
})


// Find 404 and hand over to error handler
app.use((req, res, next) => {
  next(createError(404))
})
// error handler
app.use(function (err, req, res, next) {
  console.error(err.message) // Log error message in our server's console
  if (!err.statusCode) err.statusCode = 500 // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.status(err.statusCode).send(err.message) // All HTTP requests must have a response, so let's send back an error with its status code and message
})