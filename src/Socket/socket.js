const { Server } = require('socket.io')

const createSocket = (server) => {
  const members = []
  const usersOnline = []
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
      credentials: true
    }
  })

  io.on('connection', (socket) => {
    console.log('User connected : ', socket.id)

    socket.on('userOnline', (userId) => {
      usersOnline.push({ userId, socketId: socket.id })
      console.log(usersOnline)
    })

    socket.on('userOffline', (userId) => {
      usersOnline.splice(usersOnline.indexOf(userId), 1)
      console.log(usersOnline)
    })

    socket.on('joinChat', (chatId) => {
      socket.join(chatId)
    })

    socket.on('sendMessage', (message) => {
      const { content, file, senderId, chatId } = message
      io.to(message.chatId).emit('message', message)
    })

    socket.on('deleteMessage', (message) => {
      io.to(message.chatId).emit('deleteMessage', message)
    })

    socket.on('disconnect', () => {
      usersOnline.splice(usersOnline.indexOf(socket.id), 1)
      console.log('User disconnected')
    })
  })
}

module.exports = createSocket
