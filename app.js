const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const boolParser = require('express-query-boolean')
const rateLimit = require("express-rate-limit")

const contactsRouter = require('./routes/contacts')
const usersRouter = require('./routes/users')

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(helmet())
app.get('env') !== 'test' && app.use(logger(formatsLogger))
app.use(express.static('public'))
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 100 requests per windowMs
  handler: (req, res, next) => {
    return res.status(429).json({
    status: 'error',
    code: 429,
    message: 'Too Many Requests',
  })}
});

app.use(limiter);
app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}))
app.use(express.json())
app.use(boolParser())

app.use('/api/users', usersRouter)
app.use('/api/contacts', contactsRouter)

app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

module.exports = app
