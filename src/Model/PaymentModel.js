const { DataTypes } = require('sequelize')

const paymentModel = {
  paymentId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  paymentAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  paymentStatus: {
    type: DataTypes.ENUM('Pending', 'Success', 'Failed', 'Cancelled'),
    allowNull: false,
    defaultValue: 'Pending'
  },
  orderCode: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null
  }
}

module.exports = paymentModel
