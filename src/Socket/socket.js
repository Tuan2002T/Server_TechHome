const { Server } = require('socket.io')

const createSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
      credentials: true
    }
  })

  io.on('connection', (socket) => {
    console.log('User connected')

    socket.on('disconnect', () => {
      console.log('User disconnected')
    })
  })
}

module.exports = createSocket
