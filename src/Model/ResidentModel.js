const { DataTypes } = require('sequelize')

const ResidentModel = {
  residentId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  phonenumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  idcard: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fcmToken : {
    type: DataTypes.STRING,
    allowNull: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}

module.exports = ResidentModel
