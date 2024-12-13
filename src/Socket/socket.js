const { Server } = require('socket.io')
const EventEmitter = require('events')
const { User, Resident } = require('../Model/ModelDefinition')

let io
const usersOnline = new Map()
const chatRooms = new Map()
const eventEmitter = new EventEmitter()

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

      const user = Array.from(usersOnline.values()).find(
        (u) => u.socketId === socket.id
      )
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

    socket.on('sendMessage', (message, chatId) => {
      const chatRoom = chatRooms.get(chatId)
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
      const chatRoom = chatRooms.get(chatId)
      if (!chatRoom) {
        console.error(`Chat room not found for chatId: ${chatId}`)
        return
      }

      chatRoom.users.forEach((user) => {
        io.to(user.socketId).emit('deleteMessage', messageId)
      })
    })

    socket.on('sendNotification', (notification, userIds) => {
      userIds.forEach((userId) => {
        const user = usersOnline.get(userId)
        if (user) {
          io.to(user.socketId).emit('notification', notification)
        }
      })
    })

    socket.on('sendNotificationComplaint', async (residentId, complaint) => {
      try {
        const userData = await Resident.findOne({ where: { residentId } })

        if (!userData) {
          console.error('User not found for residentId:', residentId)
          return
        }

        const userId = userData.userId
        const user = usersOnline.get(userId)

        if (user) {
          io.to(user.socketId).emit('notificationComplaint', complaint)
        }
      } catch (error) {
        console.error('Error handling sendNotificationComplaint:', error)
      }
    })

    socket.on('sendNotificationEvent', (event) => {
      const userIds = Array.from(usersOnline.keys())
      userIds.forEach((userId) => {
        const user = usersOnline.get(userId)
        if (user) {
          io.to(user.socketId).emit('notificationEvent', event)
        }
      })
    })

    socket.on('sendNotificationNotification', (userIds, notification) => {
      if (!Array.isArray(userIds)) {
        console.log('UserIds phải là mảng')
        return
      }
      userIds.forEach((userId) => {
        const user = usersOnline.get(userId)
        if (user) {
          io.to(user.socketId).emit('notificationNotification', notification)
        }
      })
    })

    socket.on('sendNotificationVehicle', (userId, vehicle) => {
      const user = usersOnline.get(userId)
      if (user) {
        io.to(user.socketId).emit('notificationVehicle', vehicle)
      }
    })

    socket.on('sendNotificationServiceBooking', (userId, serviceBooking) => {
      const user = usersOnline.get(userId)
      if (user) {
        io.to(user.socketId).emit('notificationServiceBooking', serviceBooking)
      }
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
      chatRooms.forEach((room, chatId) => {
        if (room.users.length === 0) {
          chatRooms.delete(chatId)
        }
      })

      console.log('Users online:', Array.from(usersOnline.values()))
      console.log('Chat rooms:', Array.from(chatRooms.values()))
    })
  })

  return io
}

module.exports = {
  createSocket,
  io,
  usersOnline,
  eventEmitter
}
