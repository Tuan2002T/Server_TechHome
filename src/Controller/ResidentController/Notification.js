const { Resident, Notification } = require('../../Model/ModelDefinition')

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

module.exports = {
  getAllNotifications
}
