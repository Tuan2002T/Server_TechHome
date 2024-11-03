const { Chat } = require('../../Model/ModelDefinition')

const sendMessages = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json('You are not allowed to send messages')
    }
    const chat = await Chat.findById(req.params.id)
    if (chat.adminId === req.body.adminId) {
      await chat.updateOne({ $push: { messages: req.body.message } })
      res.status(200).json('The message has been sent')
    } else {
      res.status(403).json('You can send messages only to your chat')
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

module.exports = { sendMessages }
