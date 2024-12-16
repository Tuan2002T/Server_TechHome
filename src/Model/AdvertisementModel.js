const { DataTypes } = require('sequelize')

const advertisementModel = {
  advertisementId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  advertisementName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Advertisement'
  },
  advertisementContent: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  advertisementImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  adverLocation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  advertisementStatus: {
    type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
    allowNull: false,
    defaultValue: 'INACTIVE'
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
module.exports = advertisementModel
