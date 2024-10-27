const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const { sequelize } = require('./src/Model/ModelDefinition')
require('dotenv').config()

app.use(bodyParser.json())

const adminRoute = require('./src/Routes/AdminRoute')
const residentRoute = require('./src/Routes/ResidentRoute')
const multer = require('multer')

app.use(cors())
app.use(express.json())

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})

sequelize.sync({ alter: true }).then(() => {
  console.log('Database is connected')
})
app.get('/', (req, res) => {
  res.send('Welcome to TechHome...!')
})
app.use('/admin', adminRoute)
app.use('/resident', residentRoute)

const upload = multer()
const xlsx = require('xlsx')
app.use(express.json())

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const excelData = xlsx.utils.sheet_to_json(worksheet)

    res.json(excelData)
  } catch (error) {
    res.status(500).json({ error: 'Error processing Excel file' })
  }
})

var admin = require('firebase-admin')

var serviceAccount = require('./firebase/serviceAccount.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    'https://tech-home-project-default-rtdb.asia-southeast1.firebasedatabase.app'
})

app.get('/data', async (req, res) => {
  const db = admin.database()
  const ref = db.ref('/users')

  try {
    const snapshot = await ref.once('value') // Use once to fetch data once
    const data = snapshot.val()
    console.log(data)
    res.json({ status: true, message: 'success', data })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error fetching data' })
  }
})
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket')

  const db = admin.database()
  const ref = db.ref('/users') 

  ref.on('value', (snapshot) => {
    const data = snapshot.val()
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify({ status: true, message: 'success', data }))
      } catch (error) {
        console.error('Error sending data to WebSocket client:', error)
      }
    }
  }) // Clean up on WebSocket close

  ws.on('close', () => {
    console.log('WebSocket client disconnected')
    ref.off()
  })
})
