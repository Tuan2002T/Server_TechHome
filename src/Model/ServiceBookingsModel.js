const { DataTypes } = require('sequelize')

const serviceBookingModel = {
  serviceBookingId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  residentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  bookingDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  bookingStatus: {
    type: DataTypes.STRING,
    allowNull: false
  }
}

module.exports = serviceBookingModel
