const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const { sequelize } = require('./src/Model/ModelDefinition')

require('dotenv').config()

app.use(bodyParser.json())

const adminRoute = require('./src/Routes/AdminRoute')
const residentRoute = require('./src/Routes/ResidentRoute')
const chatRoute = require('./src/Routes/ChatRoute')
const { createSocket } = require('./src/Socket/socket')

app.use(cors())
app.use(express.json())

const server = app.listen(3000, () => {
  console.log('Server is running on port 3000')
  try {
    createSocket(server)
    console.log('Socket is running')
  } catch (error) {
    console.error('Failed to start socket:', error)
  }
})

sequelize.sync({ alter: true }).then(() => {
  console.log('Database is connected')
})

app.get('/', (req, res) => {
  res.send('Welcome to TechHome...!')
})

app.use('/admin', adminRoute)
app.use('/resident', residentRoute)
app.use('/chat', chatRoute)
