const { DataTypes } = require('sequelize')

const rolesModel = {
  roleId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  roleName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}

module.exports = rolesModel
