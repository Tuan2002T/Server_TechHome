const { Server } = require('socket.io')

let io
const usersOnline = new Map()
const chatRooms = new Map()

const createSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
      credentials: true
    }
  })

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    socket.on('userOnline', (userId) => {
      usersOnline.set(userId, { userId, socketId: socket.id })
      console.log('Users online:', Array.from(usersOnline.values()))
    })

    socket.on('userOffline', (userId) => {
      usersOnline.delete(userId)
      console.log('Users online:', Array.from(usersOnline.values()))
    })

    socket.on('joinChat', (chatId) => {
      console.log('Joining chat:', chatId)

      const user = usersOnline.get(socket.id)
      if (!user) {
        console.error('User not found for socket:', socket.id)
        return
      }

      if (!chatRooms.has(chatId)) {
        chatRooms.set(chatId, { chatId, users: [] })
      }

      const chatRoom = chatRooms.get(chatId)
      if (!chatRoom.users.some((u) => u.userId === user.userId)) {
        chatRoom.users.push(user)
      }

      console.log('Chat rooms:', Array.from(chatRooms.values()))
    })

    socket.on('outChat', (chatId) => {
      const chatRoom = chatRooms.get(chatId)
      if (chatRoom) {
        chatRoom.users = chatRoom.users.filter(
          (user) => user.socketId !== socket.id
        )

        if (chatRoom.users.length === 0) {
          chatRooms.delete(chatId)
        }
      }
      console.log('Chat rooms:', Array.from(chatRooms.values()))
    })

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)

      const user = Array.from(usersOnline.values()).find(
        (user) => user.socketId === socket.id
      )
      if (user) {
        usersOnline.delete(user.userId)
      }

      chatRooms.forEach((room) => {
        room.users = room.users.filter((user) => user.socketId !== socket.id)
      })

      console.log('Users online:', Array.from(usersOnline.values()))
      console.log('Chat rooms:', Array.from(chatRooms.values()))
    })
  })
}

module.exports = {
  createSocket,
  io,
  usersOnline
}
