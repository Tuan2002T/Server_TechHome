const { DataTypes } = require('sequelize')

const apartmentModel = {
  apartmentId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  apartmentNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apartmentType: {
    type: DataTypes.STRING,
    allowNull: false
  }
}

module.exports = apartmentModel
