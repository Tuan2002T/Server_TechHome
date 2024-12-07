const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const { sequelize } = require('./src/Model/ModelDefinition')
const { createDatabase } = require('./db/dbsetup')
const { insertData } = require('./db/data')

require('dotenv').config()

const init = async () => {
  app.use(bodyParser.json())
  app.use(cors())
  app.use(express.json())

  const adminRoute = require('./src/Routes/AdminRoute')
  const residentRoute = require('./src/Routes/ResidentRoute')
  const chatRoute = require('./src/Routes/ChatRoute')
  const createSocket = require('./src/Socket/socket')

  // Connect to database and sync models
  try {
    await sequelize.sync({ alter: true })
    console.log('Database is connected and models are synced')

    // Seed data after database is synced
    try {
      await createDatabase()
      await insertData()
      console.log('Data seeding completed successfully')
    } catch (error) {
      console.error('Error seeding data:', error)
    }
  } catch (error) {
    console.error('Failed to connect to database:', error)
    process.exit(1)
  }

  // Start server after database operations
  const server = app.listen(3000, () => {
    console.log('Server is running on port 3000')
    try {
      createSocket(server)
      console.log('Socket is running')
    } catch (error) {
      console.error('Failed to start socket:', error)
    }
  })

  app.get('/', (req, res) => {
    res.send('Welcome to TechHome...!')
  })

  app.use('/admin', adminRoute)
  app.use('/resident', residentRoute)
  app.use('/chat', chatRoute)
}

// Start the application
init().catch((error) => {
  console.error('Failed to initialize application:', error)
  process.exit(1)
})
