const {
  uploadMultipleToS3,
  bucketName,
  getFileTypeFromMimeType,
  deleteMultipleFromS3
} = require('../../AWS/s3')
const { Chat, Message, Resident, File } = require('../../Model/ModelDefinition')

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
      !chat.Residents.some(
        (resident) => resident.residentId === req.resident.residentId
      )
    ) {
      return res.status(403).json('You are not a member of this chat')
    }

    const message = await Message.create({
      chatId: chat.chatId,
      senderId: req.resident.residentId,
      content: req.body.message,
      sentAt: new Date()
    })

    const files = req.files

    const checkMimetype = files.some(
      (file) =>
        !['image', 'video', 'document'].includes(file.mimetype.split('/')[0])
    )

    if (checkMimetype) {
      return res.status(400).json('Invalid file type')
    }

    let url = []

    if (files && files.length > 0) {
      const fileUrls = await uploadMultipleToS3(files, bucketName, 'chat/')

      url = fileUrls
      for (const [index, fileUrl] of fileUrls.entries()) {
        const fileType = getFileTypeFromMimeType(files[index].mimetype)

        const file = await File.create({
          fileName: `${message.messageId}_${index + 1}`,
          fileUrl,
          fileType: fileType,
          fileSize: files[index].size,
          fileDate: new Date()
        })

        await message.addFile(file)
      }
    }

    const response = {
      message: {
        ...message.get({ plain: true }),
        files: url
      }
    }

    res.status(201).json({ response })
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
        attributes: ['fileId', 'fileName', 'fileUrl'],
        through: {
          attributes: []
        }
      }
    })

    res.status(200).json({ messages })
  } catch (error) {
    res.status(500).json(error)
    console.log('Error getting messages:', error)
  }
}

module.exports = {
  sendMessages,
  deleteMessage,
  getAllMessagesByChatId
}
