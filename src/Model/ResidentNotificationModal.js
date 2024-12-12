module.exports = (sequelize, DataTypes) => {
  const ResidentNotification = sequelize.define('ResidentNotification', {
    notificationId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    residentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  })

  ResidentNotification.associate = (models) => {
    // We define associations for ResidentApartment, although it’s usually implicitly handled by Sequelize in the through table
    ResidentNotification.belongsTo(models.Resident, {
      foreignKey: 'residentId'
    })
    ResidentNotification.belongsTo(models.Notification, {
      foreignKey: 'notificationId'
    })
  }

  return ResidentNotification
}
