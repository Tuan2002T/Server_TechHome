const { DataTypes } = require('sequelize')

const notificationModel = {
  notificationId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  notificationTitle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  notificationBody: {
    type: DataTypes.STRING,
    allowNull: false
  }
}

module.exports = notificationModel
