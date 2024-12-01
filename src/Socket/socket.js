const { Server } = require('socket.io')

let io
const usersOnline = []
let chatRooms = []

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
      const existingUser = usersOnline.find((user) => user.userId === userId)
      if (existingUser) {
        existingUser.socketId = socket.id
      } else {
        usersOnline.push({ userId, socketId: socket.id })
      }
      console.log('Users online:', usersOnline)
    })

    socket.on('userOffline', (userId) => {
      const userIndex = usersOnline.findIndex((user) => user.userId === userId)
      if (userIndex !== -1) {
        usersOnline.splice(userIndex, 1)
      }
      console.log('Users online:', usersOnline)
    })

    socket.on('joinChat', (chatId) => {
      console.log('Joining chat:', chatId)

      const user = usersOnline.find((user) => user.socketId === socket.id)
      if (!user) {
        console.error('User not found for socket:', socket.id)
        return
      }

      let chatRoom = chatRooms.find((room) => room.chatId === chatId)
      if (!chatRoom) {
        chatRoom = { chatId, users: [] }
        chatRooms.push(chatRoom)
      }

      const isUserInRoom = chatRoom.users.some((u) => u.socketId === socket.id)
      if (!isUserInRoom) {
        chatRoom.users.push(user)
      }
      console.log('Chat rooms:', chatRooms)
    })

    socket.on('outChat', (chatId) => {
      const chatRoom = chatRooms.find((room) => room.chatId === chatId)
      if (chatRoom) {
        chatRoom.users = chatRoom.users.filter(
          (user) => user.socketId !== socket.id
        )

        if (chatRoom.users.length === 0) {
          chatRooms = chatRooms.filter((room) => room.chatId !== chatId)
        }
      }
      console.log('Chat rooms:', chatRooms)
    })

    socket.on('sendMessage', (message, chatId) => {
      const chatRoom = chatRooms.find((room) => room.chatId === chatId)
      if (!chatRoom) {
        console.error(`Chat room not found for chatId: ${chatId}`)
        return
      }

      chatRoom.users.forEach((user) => {
        if (user.socketId !== socket.id) {
          io.to(user.socketId).emit('receiveMessage', message)
        }
      })
    })

    socket.on('deleteMessage', (chatId, messageId) => {
      const chatRoom = chatRooms.find((room) => room.chatId === chatId)
      if (!chatRoom) {
        console.error(`Chat room not found for chatId: ${message.chatId}`)
        return
      }

      chatRoom.users.forEach((user) => {
        io.to(user.socketId).emit('deleteMessage', messageId)
      })
    })

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)

      const userIndex = usersOnline.findIndex(
        (user) => user.socketId === socket.id
      )
      if (userIndex !== -1) {
        usersOnline.splice(userIndex, 1)
      }

      chatRooms.forEach((room) => {
        room.users = room.users.filter((user) => user.socketId !== socket.id)
      })
      chatRooms = chatRooms.filter((room) => room.users.length > 0)

      console.log('Users online:', usersOnline)
      console.log('Chat rooms:', chatRooms)
    })
  })
}

module.exports = createSocket
