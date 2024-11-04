const express = require('express')
const router = express.Router()
const auth = require('../Middleware/auth')
const {
  createChat,
  addMember,
  removeMember,
  deleteChat,
  getAllChats
} = require('../Controller/ChatController/ChatService')
const {
  sendMessages,
  deleteMessage,
  getAllMessagesByChatId
} = require('../Controller/ChatController/Message')
const { upload, uploadMultiple } = require('../AWS/s3')

router.post('/createChat', auth, createChat)
router.post('/addMember/:id', auth, addMember)
router.delete('/removeMember/:id', auth, removeMember)
router.delete('/deleteChat/:id', auth, deleteChat)
router.post('/sendMessages/:id', auth, uploadMultiple, sendMessages)
router.delete('/deleteMessage/:id', auth, deleteMessage)
router.get('/getAllChats', auth, getAllChats)
router.get('/getAllMessagesByChatId/:id', auth, getAllMessagesByChatId)

module.exports = router
