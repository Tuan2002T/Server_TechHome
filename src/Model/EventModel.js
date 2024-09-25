const { DataTypes } = require('sequelize')

const eventModel = {
  eventId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  eventName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  eventDescription: {
    type: DataTypes.STRING,
    allowNull: false
  },
  eventLocation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  eventDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
}

module.exports = eventModel
