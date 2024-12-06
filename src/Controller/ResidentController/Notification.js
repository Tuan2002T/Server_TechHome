const {
  Resident,
  Notification,
  sequelize
} = require('../../Model/ModelDefinition')

const getAllNotifications = async (req, res) => {
  try {
    if (req.user.roleId !== 2) {
      return res
        .status(403)
        .json({ message: 'You are not allowed to access this resource' })
    }

    const notifications = await Resident.findAll({
      where: { residentId: req.user.userId },
      include: [
        {
          model: Notification,
          through: 'ResidentNotifications',
          required: true
        }
      ]
    })

    const notificationDetails = notifications.flatMap(
      (resident) => resident.Notifications
    )

    res.json(notificationDetails)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const readNotification = async (req, res) => {
  try {
    if (req.user.roleId !== 2) {
      return res
        .status(403)
        .json({ message: 'You are not allowed to access this resource' })
    }

    const notification = await Notification.findOne({
      where: { notificationId: req.params.notificationId }
    })

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }

    await sequelize.models.ResidentNotifications.update(
      { status: true },
      {
        where: {
          residentId: req.user.userId,
          notificationId: req.params.notificationId
        }
      }
    )

    res.json({ message: 'Notification read' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}

const readAllNotifications = async (req, res) => {
  try {
    if (req.user.roleId !== 2) {
      return res
        .status(403)
        .json({ message: 'You are not allowed to access this resource' })
    }

    await sequelize.models.ResidentNotifications.update(
      { status: true },
      {
        where: {
          residentId: req.user.userId
        }
      }
    )

    res.json({ message: 'All notifications read' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getAllNotifications,
  readNotification,
  readAllNotifications
}
