require('dotenv').config()
const { config } = require('./db/config')
const { Server } = require('./src/server')

async function main() {
  try {
    const server = new Server(config)
    await server.initialize()
  } catch (error) {
    console.log('Application failed to start:', error)
    process.exit(1)
  }
}

main()
