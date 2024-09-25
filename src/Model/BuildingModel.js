const { DataTypes } = require('sequelize')

const buildingModel = {
  buildingId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  buildingName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  buildingAddress: {
    type: DataTypes.STRING,
    allowNull: false
  }
}

module.exports = buildingModel
