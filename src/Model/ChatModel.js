const { DataTypes } = require('sequelize')

const chatModel = {
  chatId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  chatName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Admins',
      key: 'adminId'
    }
  },
  chatType: {
    type: DataTypes.ENUM('admin', 'bot', 'apartment'),
    allowNull: false
  },
  chatDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
}

module.exports = chatModel
