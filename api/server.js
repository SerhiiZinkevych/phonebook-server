const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const Mogoose = require('mongoose')

const contactsRouter = require('./contacts/contacts.routes')

require('dotenv').config()

class Server {
  constructor() {
    this.server = null
  }

  async start() {
    this.initServer()
    this.initMiddleWares()
    this.initRoutes()
    await this.initDB()
    return this.startListening()
  }

  initServer() {
    this.server = express()
  }

  async initDB() {
    try {
      await Mogoose.connect(process.env.MONGODB_URL, {
        useFindAndModify: false,
      })
      console.log('Database connection successful')
    } catch (error) {
      console.log(error)
      process.exit(1)
    }
  }

  initMiddleWares() {
    const formatsLogger =
      this.server.get('env') === 'development' ? 'dev' : 'short'

    this.server.use(logger(formatsLogger))
    this.server.use(cors())
    this.server.use(express.json())
  }

  initRoutes() {
    this.server.use('/api/contacts', contactsRouter)

    this.server.use((req, res) => {
      res.status(404).json({ message: 'Not found' })
    })

    this.server.use((err, req, res, next) => {
      res.status(500).json({ message: err.message })
    })
  }

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log('Server started listening on port:', process.env.PORT)
    })
  }
}

module.exports = Server
