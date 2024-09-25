const { DataTypes } = require('sequelize')

const complainModel = {
  complainId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  complainDescription: {
    type: DataTypes.STRING,
    allowNull: false
  },
  complainDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  complainStatus: {
    type: DataTypes.STRING,
    allowNull: false
  }
}

module.exports = complainModel
