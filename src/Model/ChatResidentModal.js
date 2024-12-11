module.exports = (sequelize, DataTypes) => {
  const ChatResident = sequelize.define('ChatResident', {
    chatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Chats',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    residentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Residents',
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  })

  ChatResident.associate = (models) => {
    ChatResident.belongsTo(models.Chat, {
      foreignKey: 'chatId',
      onDelete: 'CASCADE'
    })
    ChatResident.belongsTo(models.Resident, {
      foreignKey: 'residentId',
      onDelete: 'CASCADE'
    })
  }

  return ChatResident
}
