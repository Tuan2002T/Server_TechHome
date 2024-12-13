const { DataTypes } = require('sequelize')

const billModel = {
  billId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  billName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Bill'
  },
  residentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Residents',
      key: 'residentId'
    }
  },
  billAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  billDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  billStatus: {
    type: DataTypes.ENUM('UNPAID', 'PAID', 'CANCELLED'),
    allowNull: false,
    defaultValue: 'UNPAID'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}

module.exports = billModel
