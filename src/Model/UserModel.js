const { DataTypes } = require('sequelize')

const userModel = {
  userId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue:
      'https://techhomearchive.s3.ap-southeast-1.amazonaws.com/defautavatar.jpg'
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: true
  },
}

module.exports = userModel
