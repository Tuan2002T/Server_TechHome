const { DataTypes } = require('sequelize')

const messageModel = {
  messageId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  chatId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Chats',
      key: 'chatId'
    }
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Files',
      key: 'fileId'
    }
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}

module.exports = messageModel
