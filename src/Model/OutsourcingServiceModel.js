const { DataTypes } = require('sequelize')

const outsourcingServiceModel = {
  outsourcingServiceId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  outsourcingServiceName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'OutsourcingService'
  },
  outsourcingServiceDescription: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  outsourcingServiceImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  outsourcingServiceStatus: {
    type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
    allowNull: false,
    defaultValue: 'INACTIVE'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  outsourceServicePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  outsourceServiceLocation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  outsourcingServiceType: {
    type: DataTypes.ENUM('FOOD', 'DRINKS', 'OTHER'),
    allowNull: false,
    defaultValue: 'FOOD'
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}

module.exports = outsourcingServiceModel
