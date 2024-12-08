const express = require('express')
const cors = require('cors')
const { DatabaseManager } = require('../db/database')
const { setupRoutes } = require('./Routes/AdminRoute')
const { setupSocket } = require('./socket/socket')

class Server {
  constructor(config) {
    this.config = config
    this.app = express()
    this.db = new DatabaseManager(config.db)
  }

  setupMiddleware() {
    this.app.use(express.json())
    this.app.use(cors(this.config.server.corsOptions))
  }

  async initialize() {
    try {
      // Create database if needed
      const isNew = await this.db.createDatabase()

      // Connect to database
      await this.db.connect()

      // Setup express middleware
      this.setupMiddleware()

      // Setup routes
      setupRoutes(this.app)

      // Initialize server
      const server = this.app.listen(this.config.server.port, () => {
        logger.info(`Server running on port ${this.config.server.port}`)
      })

      // Setup WebSocket
      setupSocket(server)

      // Handle cleanup on shutdown
      this.setupGracefulShutdown(server)

      // Seed data if new database
      if (isNew) {
        await this.seedData()
      }
    } catch (error) {
      logger.error('Server initialization failed:', error)
      throw error
    }
  }

  setupGracefulShutdown(server) {
    const shutdown = async () => {
      logger.info('Shutting down gracefully...')
      server.close(async () => {
        await this.db.end()
        process.exit(0)
      })
    }

    process.on('SIGTERM', shutdown)
    process.on('SIGINT', shutdown)
  }

  async seedData() {
    try {
      await this.db.withTransaction(async (client) => {
        // Insert your seed data here
        await client.query(/* Your seed data queries */)
      })
      logger.info('Data seeding completed successfully')
    } catch (error) {
      logger.error('Data seeding failed:', error)
      throw error
    }
  }
}

module.exports = Server
