const { DataTypes } = require('sequelize')

const facilityModel = {
  facilityId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  facilityName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  facilityDescription: {
    type: DataTypes.STRING,
    allowNull: false
  },
  facilityLocation: {
    type: DataTypes.STRING,
    allowNull: false
  }
}

module.exports = facilityModel
