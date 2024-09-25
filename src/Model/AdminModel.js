const { DataTypes } = require('sequelize')

const adminModel = {
  adminId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }
}

module.exports = adminModel
