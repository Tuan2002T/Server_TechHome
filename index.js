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
const { createSocket, io, usersOnline } = require('./src/Socket/socket')
const { payment } = require('./src/Controller/ResidentController/Payment')

app.use(cors())
app.use(express.json())

let ioBE
const server = app.listen(3000, () => {
  console.log('Server is running on port 3000')
  try {
    ioBE = createSocket(server)
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
app.post('/webhook', async (req, res) => {
  const { data, desc } = req.body
  if (data && data.orderCode == 123) {
    return res.status(200).json({ message: 'Payment successful' })
  }
  try {
    const paymentRecord = await payment(data, desc)
    console.log('Payment record:', paymentRecord)

    const user = usersOnline.get(paymentRecord.userId)
    if (user) {
      ioBE.to(user.socketId).emit('webhookPayment', 'Thanh toán thành công')
    }

    res.status(200).json({ message: 'Webhook received' })
  } catch (error) {
    console.error('Error processing webhook:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})
