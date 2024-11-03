const { Chat } = require('../../Model/ModelDefinition')

const getAllChats = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json('You are not allowed to see all chats')
    }
    const chats = await Chat.find()
    res.status(200).json(chats)
  } catch (error) {
    res.status(500).json(error)
  }
}

const createChat = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json('You are not allowed to create a chat')
    }
    const newChat = new Chat(req.body)
    const chat = await newChat.save()
    res.status(200).json(chat)
  } catch (error) {
    res.status(500).json(error)
  }
}

const updateChat = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json('You are not allowed to update a chat')
    }
    const chat = await Chat.findById(req.params.id)
    if (chat.adminId === req.body.adminId) {
      await chat.updateOne({ $set: req.body })
      res.status(200).json('The chat has been updated')
    } else {
      res.status(403).json('You can update only your chat')
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

const deleteChat = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json('You are not allowed to delete a chat')
    }
    const chat = await Chat.findById(req.params.id)
    if (chat.adminId === req.body.adminId) {
      await chat.deleteOne()
      res.status(200).json('The chat has been deleted')
    } else {
      res.status(403).json('You can delete only your chat')
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

const deleteMember = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json('You are not allowed to delete a member')
    }
    const chat = await Chat.findById(req.params.id)
    if (chat.adminId === req.body.adminId) {
      await chat.updateOne({ $pull: { members: req.body.memberId } })
      res.status(200).json('The member has been deleted')
    } else {
      res.status(403).json('You can delete only your member')
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

const addMember = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json('You are not allowed to add a member')
    }
    const chat = await Chat.findById(req.params.id)
    if (chat.adminId === req.body.adminId) {
      await chat.updateOne({ $push: { members: req.body.memberId } })
      res.status(200).json('The member has been added')
    } else {
      res.status(403).json('You can add only your member')
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

module.exports = {
  getAllChats,
  createChat,
  updateChat,
  deleteChat,
  deleteMember,
  addMember
}
