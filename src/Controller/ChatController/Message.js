const {
  uploadMultipleToS3,
  bucketName,
  getFileTypeFromMimeType,
  deleteMultipleFromS3
} = require('../../AWS/s3')
const { notificationPush } = require('../../FireBase/NotificationPush')
const {
  Chat,
  Message,
  Resident,
  File,
  User
} = require('../../Model/ModelDefinition')
const getAIResponse = require('../../OpenAI/openai')

const sendMessages = async (req, res) => {
  try {
    // if (req.user.roleId !== 1) {
    //   return res.status(403).json('You are not allowed to send messages');
    // }

    const chat = await Chat.findOne({
      where: { chatId: req.params.id },
      include: {
        model: Resident,
        as: 'Residents',
        through: {
          attributes: []
        }
      }
    })

    if (!chat) {
      return res.status(404).json('Chat not found')
    }

    if (
      !chat.Residents.some((resident) => resident.userId === req.user.userId) &&
      !chat.adminId === req.user.userId
    ) {
      return res.status(403).json('You are not a member of this chat')
    }

    const message = await Message.create({
      chatId: chat.chatId,
      senderId: req.user.userId,
      content: req.body.message,
      sentAt: new Date()
    })

    const files = req.files
    console.log(files)

    const checkMimetype = files.some(
      (file) =>
        !['image', 'video', 'document', 'application', 'text'].includes(
          file.mimetype.split('/')[0]
        )
    )

    console.log(checkMimetype)

    if (checkMimetype) {
      return res.status(400).json('Invalid file type')
    }

    let url = []

    if (files && files.length > 0) {
      const fileUrls = await uploadMultipleToS3(files, bucketName, 'chat/')

      // url = fileUrls
      for (const [index, fileUrl] of fileUrls.entries()) {
        const fileType = getFileTypeFromMimeType(files[index].mimetype)

        const file = await File.create({
          fileName: `${message.messageId}_${index + 1}`,
          fileUrl,
          fileType: fileType,
          fileSize: files[index].size,
          fileDate: new Date()
        })
        url.push({
          fileId: file.fileId,
          fileName: file.fileName,
          fileUrl: file.fileUrl,
          fileType: file.fileType
        })
        await message.addFile(file)
      }
    }

    const response = {
      message: {
        ...message.get({ plain: true }),
        Files: url
      }
    }

    chat.Residents.forEach(async (resident) => {
      if (
        resident.userId !== req.user.userId &&
        resident.fcmToken !== null &&
        resident.fcmToken !== ''
      ) {
        console.log('Sending notification to:', resident.fcmToken)

        notificationPush(
          resident.fcmToken,
          'New message',
          `${req.user.firstName} ${req.user.lastName} sent a message in ${chat.chatName}`
        )
      }
    })

    res.status(201).json(response.message)
  } catch (error) {
    res.status(500).json(error)
    console.log('Error sending message:', error)
  }
}

const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id, {
      include: {
        model: File,
        as: 'Files'
      }
    })

    if (!message) {
      return res.status(404).json('Message not found')
    }

    if (message.senderId !== req.resident.residentId) {
      return res.status(403).json('You are not allowed to delete this message')
    }

    await message.setFiles([])

    const fileUrls = message.Files.map((file) => file.fileUrl)
    if (fileUrls.length > 0) {
      await deleteMultipleFromS3(fileUrls, bucketName)
    }

    await Promise.all(
      message.Files.map((file) =>
        File.destroy({ where: { fileId: file.fileId } })
      )
    )

    await message.destroy()

    res.status(200).json('Message deleted successfully')
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error deleting message', details: error.message })
    console.log('Error deleting message:', error)
  }
}

const getAllMessagesByChatId = async (req, res) => {
  const { offset = 0, limit } = req.query

  try {
    const chat = await Chat.findOne({
      where: { chatId: req.params.id }
    })

    if (!chat) {
      return res.status(404).json('Chat not found')
    }

    const { count, rows: messages } = await Message.findAndCountAll({
      where: { chatId: req.params.id },
      include: {
        model: File,
        as: 'Files',
        attributes: ['fileId', 'fileName', 'fileUrl', 'fileType'],
        through: { attributes: [] }
      },
      order: [['sentAt', 'DESC']],
      offset: parseInt(offset),
      limit: parseInt(limit)
    })

    const totalPages = Math.ceil(count / limit)

    const messagesWithAvatars = await Promise.all(
      messages.map(async (message) => {
        const user = await User.findOne({
          where: { userId: message.senderId },
          attributes: ['avatar']
        })

        return {
          ...message.toJSON(),
          avatar: user ? user.avatar : null
        }
      })
    )

    res.status(200).json({
      messages: messagesWithAvatars.reverse(),
      totalPages,
      totalMessages: count
    })
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' })
    console.log('Error getting messages:', error)
  }
}

const getAllFilesByChatId = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      where: { chatId: req.params.id }
    })

    if (!chat) {
      return res.status(404).json('Chat not found')
    }

    const messages = await Message.findAll({
      where: { chatId: req.params.id },
      include: {
        model: File,
        as: 'Files',
        attributes: ['fileId', 'fileName', 'fileUrl', 'fileType'],
        through: { attributes: [] }
      }
    })

    const files = messages.reduce((acc, message) => {
      const messageFiles = message.Files.map((file) => {
        return {
          ...file.get({ plain: true }),
          messageId: message.messageId
        }
      })

      return [...acc, ...messageFiles]
    }, [])

    res.status(200).json({ files: files })
  } catch (error) {
    res.status(500).json({ error: 'Error fetching files' })
    console.log('Error getting files:', error)
  }
}

const sendMessageAI = async (req, res) => {
  try {
    const { message } = req.body
    const response = await getAIResponse(message)
    console.log(response)

    const aiReply = response.choices[0].message.content.trim()
    res.status(200).json({ reply: aiReply })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Có lỗi xảy ra. Vui lòng thử lại sau.' })
  }
}

module.exports = {
  sendMessages,
  deleteMessage,
  getAllMessagesByChatId,
  sendMessageAI,
  getAllFilesByChatId
}
