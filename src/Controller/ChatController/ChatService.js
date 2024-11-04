const { Chat, Resident } = require('../../Model/ModelDefinition')

require('../../Model/ModelDefinition')

const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.findAll({
      include: [
        {
          model: Resident,
          as: 'Residents',
          where: { residentId: req.resident.residentId },
          required: true,
          attributes: []
        }
      ]
    })

    res.status(200).json({
      data: chats
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving chats',
      error: error.message
    })
  }
}

const createChat = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({
        message: 'You do not have permission to create a chat'
      })
    }

    const { chatName, chatType, residentIds } = req.body

    const newChat = await Chat.create({
      chatName,
      chatType,
      adminId: req.admin.adminId,
      chatDate: new Date()
    })

    if (residentIds && Array.isArray(residentIds) && residentIds.length > 0) {
      await newChat.addResidents(residentIds)
    }

    res.status(201).json({
      message: 'Chat created successfully',
      data: newChat
    })
  } catch (error) {
    console.error('Error creating chat:', error)
    res.status(500).json({
      message: 'Error creating chat',
      error: error.message
    })
  }
}

const updateChat = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({
        message: 'You do not have permission to update this chat'
      })
    }

    const chat = await Chat.findById(req.params.id)
    if (!chat) {
      return res.status(404).json({
        message: 'Chat not found'
      })
    }

    if (chat.adminId === req.body.adminId) {
      await chat.updateOne({ $set: req.body })
      res.status(200).json({
        message: 'Chat updated successfully'
      })
    } else {
      res.status(403).json({
        message: 'You can only update chats you created'
      })
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error updating chat',
      error: error.message
    })
  }
}

const deleteChat = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({
        message: 'You do not have permission to delete this chat'
      })
    }

    const chat = await Chat.findByPk(req.params.id)
    if (!chat) {
      return res.status(404).json({
        message: 'Chat not found'
      })
    }

    if (chat.adminId !== req.admin.adminId) {
      return res.status(403).json({
        message: 'You can only delete chats you created'
      })
    }

    await chat.setResidents([])

    // Xóa chat
    await chat.destroy()
    res.status(200).json({
      message: 'Chat deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting chat:', error)
    res.status(500).json({
      message: 'Error deleting chat',
      error: error.message
    })
  }
}

const removeMember = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({
        message: 'You do not have permission to remove members'
      })
    }

    const chat = await Chat.findByPk(req.params.id)
    if (!chat) {
      return res.status(404).json({
        message: 'Chat not found'
      })
    }

    if (chat.adminId !== req.admin.adminId) {
      return res.status(403).json({
        message: 'You can only remove members from chats you created'
      })
    }

    const residents = await chat.getResidents({
      where: { residentId: req.body.memberId }
    })

    if (residents.length === 0) {
      return res.status(400).json({
        message: 'Member does not exist in this chat'
      })
    }

    await chat.removeResident(req.body.memberId)

    res.status(200).json({
      message: 'Member removed successfully'
    })
  } catch (error) {
    console.error('Error removing member:', error)
    res.status(500).json({
      message: 'Error removing member',
      error: error.message
    })
  }
}

const addMember = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({
        message: 'You do not have permission to add members'
      })
    }

    const memberId = req.body.memberId
    const chat = await Chat.findByPk(req.params.id)

    if (!chat) {
      return res.status(404).json({
        message: 'Chat not found'
      })
    }

    const residents = await chat.getResidents({
      where: { residentId: memberId }
    })

    if (residents.length > 0) {
      return res.status(400).json({
        message: 'Member already exists in this chat'
      })
    }

    await chat.addResident(memberId, {
      through: { joinedDate: new Date() }
    })

    res.status(200).json({
      message: 'Member added successfully'
    })
  } catch (error) {
    console.error('Error adding member:', error)
    res.status(500).json({
      message: 'Error adding member',
      error: error.message
    })
  }
}

module.exports = {
  getAllChats,
  createChat,
  updateChat,
  deleteChat,
  removeMember,
  addMember
}
