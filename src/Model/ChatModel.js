const { DataTypes } = require('sequelize')

const chatModel = {
  chatId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  residentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Residents',
      key: 'residentId'
    }
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
    type: DataTypes.ENUM('admin', 'community', 'apartment'),
    allowNull: false
  },
  chatDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
}

module.exports = chatModel
