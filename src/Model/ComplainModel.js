const { DataTypes } = require('sequelize')

const complainModel = {
  complainId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  complaintDescription: {
    type: DataTypes.STRING,
    allowNull: false
  },
  complaintDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  complaintStatus: {
    type: DataTypes.STRING,
    allowNull: false
  }
}

module.exports = complainModel
