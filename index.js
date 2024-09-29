const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const { sequelize } = require('./src/Model/ModelDefinition')
require('dotenv').config()

app.use(bodyParser.json())

const adminRoute = require('./src/Routes/AdminRoute')
const residentRoute = require('./src/Routes/ResidentRoute')

app.use(cors())
app.use(express.json())

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})

sequelize.sync({ alter: true }).then(() => {
  console.log('Database is connected')
  // initializeDefaultAdmin()
})
app.get('/', (req, res) => {
  res.send('Welcome to TechHome...!')
})
app.use('/admin', adminRoute)
app.use('/resident', residentRoute)
