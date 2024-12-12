module.exports = (sequelize, DataTypes) => {
  const ResidentApartment = sequelize.define('ResidentApartment', {
    apartmentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    residentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  })

  ResidentApartment.associate = (models) => {
    // We define associations for ResidentApartment, although it’s usually implicitly handled by Sequelize in the through table
    ResidentApartment.belongsTo(models.Apartment, { foreignKey: 'apartmentId' })
    ResidentApartment.belongsTo(models.Resident, { foreignKey: 'residentId' })
  }

  return ResidentApartment
}
