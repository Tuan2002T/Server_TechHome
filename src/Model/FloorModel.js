const { DataTypes } = require('sequelize')

const floorModel = {
  floorId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  floorNumber: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}
module.exports = floorModel
