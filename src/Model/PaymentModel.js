const { DataTypes } = require('sequelize')

const paymentModel = {
  paymentId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  paymentAmount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  paymentStatus: {
    type: DataTypes.STRING,
    allowNull: false
  }
}

module.exports = paymentModel
