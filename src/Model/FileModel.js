const { DataTypes } = require('sequelize')

const fileModel = {
  fileId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileType: {
    type: DataTypes.ENUM('image', 'video', 'document'),
    allowNull: false
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fileDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
}

module.exports = fileModel
