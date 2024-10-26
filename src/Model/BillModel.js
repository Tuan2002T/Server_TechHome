const { DataTypes } = require('sequelize')

const billModel = {
  billId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  residentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    billType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    billAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    billDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    billStatus: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }
}

module.exports = billModel
