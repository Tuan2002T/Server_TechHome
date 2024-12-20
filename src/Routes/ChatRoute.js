const express = require('express')
const router = express.Router()
const auth = require('../Middleware/auth')
const {
  createChat,
  addMember,
  removeMember,
  deleteChat,
  getAllChats,
  getChatById,
  updateChat
} = require('../Controller/ChatController/ChatService')
const {
  sendMessages,
  deleteMessage,
  getAllMessagesByChatId,
  sendMessageAI,
  getAllFilesByChatId
} = require('../Controller/ChatController/Message')
const { upload, uploadMultiple } = require('../AWS/s3')
const { sendChatBot } = require('../Controller/ResidentController')

router.post('/createChat', auth, createChat)
router.post('/addMember/:id', auth, addMember)
router.delete('/removeMember/:id', auth, removeMember)
router.delete('/deleteChat/:id', auth, deleteChat)
router.post('/sendMessages/:id', auth, uploadMultiple, sendMessages)
router.delete('/deleteMessage/:id', auth, deleteMessage)
router.get('/getAllChats', auth, getAllChats)
router.get('/getAllMessagesByChatId/:id', auth, getAllMessagesByChatId)
router.post('/sendMessageAI', sendMessageAI)
router.post('/sendChatBot', auth, sendChatBot)
router.get('/getAllFilesByChatId/:id', auth, getAllFilesByChatId)
router.get('/getChatById/:id', auth, getChatById)
router.put('/updateChat/:id', auth, updateChat)

module.exports = router
