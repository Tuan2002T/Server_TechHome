const { DataTypes } = require('sequelize')

const vehicleModel = {
  vehicleId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  vehicleNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  vehicleType: {
    type: DataTypes.STRING,
    allowNull: false
  }
}
module.exports = vehicleModel
