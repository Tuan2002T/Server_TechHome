const { Server } = require('socket.io')

const createSocket = (server) => {
  const members = []
  const usersOnline = []
  let chatRooms = []
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
      console.log('Joining chat : ', chatId)

      const user = usersOnline.find((user) => user.socketId === socket.id)
      console.log(user)

      const existingChat = chatRooms.find((room) => room.chatId === chatId)

      if (existingChat) {
        existingChat.users.push(user)
      } else {
        chatRooms.push({ chatId, users: [user] })
      }
      console.log(chatRooms)
    })

    socket.on('outChat', (chatId) => {
      const chatRoom = chatRooms.find((room) => room.chatId === chatId)

      if (chatRoom) {
        const userIndex = chatRoom.users.findIndex(
          (user) => user.socketId === socket.id
        )

        if (userIndex !== -1) {
          chatRoom.users.splice(userIndex, 1)

          if (chatRoom.users.length === 0) {
            chatRooms = chatRooms.filter((room) => room.chatId !== chatId)
          }
        }
      }
      console.log(chatRooms)
    })

    socket.on('sendMessage', (message, chatId) => {
      const chatRoom = chatRooms.find((room) => room.chatId === chatId)
      chatRoom.users.forEach((user) => {
        if (user.socketId !== socket.id) {
          io.to(user.socketId).emit('receiveMessage', message);
        }
      });
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
