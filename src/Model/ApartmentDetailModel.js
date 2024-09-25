const { DataTypes } = require('sequelize')

const apartmentDetailModel = {
  apartmentDetailId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }
}

module.exports = apartmentDetailModel
