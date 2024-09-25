const { DataTypes } = require('sequelize')

const serviceModel = {
  serviceId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  serviceName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  servicePrice: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}

module.exports = serviceModel
