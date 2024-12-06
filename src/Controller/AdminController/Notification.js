const {
  sequelize,
  Vehicle,
  Resident,
  User,
  Complaint,
  Facility,
  Notification
} = require('../../Model/ModelDefinition')

const getNotifications = async (req, res) => {
  try {
    const rs = await Notification.findAll()
    return res.status(200).json({
      status: true,
      data: rs
    })
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'An error occurred while retrieving notifications.'
    })
  }
}

module.exports = {
  getNotifications
}
