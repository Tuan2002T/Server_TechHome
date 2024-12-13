const {
  Notification,
  sequelize,
  Resident
} = require('../../Model/ModelDefinition')

const getNotifications = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const services = await Notification.findAll()
    res.status(200).json({ data: services })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// delete notifications

const deleteNotification = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const notification = await Notification.findByPk(req.params.id)

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }

    await notification.destroy()
    res.status(204).send()
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// add notifications

const addNotification = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const { notificationTitle, notificationBody } = req.body

    const newNotification = await Notification.create({
      notificationTitle,
      notificationBody
    })
    res.status(201).json({ data: newNotification })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// update notifications

const updateNotification = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const notification = await Notification.findByPk(req.params.id)

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }

    const { notificationTitle, notificationBody } = req.body

    await notification.update({ notificationTitle, notificationBody })
    res.status(200).json({ data: notification })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const sendNotificationToResidents = async (req, res) => {
  const t = await sequelize.transaction()
  try {
    if (req.user.roleId !== 1) {
      return res
        .status(403)
        .json({ message: 'Truy cập bị từ chối. Chỉ dành cho admin.' })
    }

    const { notificationId, residentIds } = req.body

    if (!Array.isArray(residentIds) || residentIds.length === 0) {
      return res
        .status(400)
        .json({ message: 'Mảng residentIds không hợp lệ hoặc rỗng' })
    }

    const notification = await Notification.findByPk(notificationId)
    if (!notification) {
      return res.status(404).json({ message: 'Không tìm thấy thông báo' })
    }

    const existingResidents = await Resident.findAll({
      where: {
        residentId: residentIds
      }
    })

    if (existingResidents.length !== residentIds.length) {
      return res.status(400).json({ message: 'Một số cư dân không tồn tại' })
    }

    await notification.addResidents(existingResidents, {
      through: { status: false },
      transaction: t
    })

    await t.commit()

    res.status(201).json({
      message: 'Thông báo đã được gửi đến các cư dân',
      data: notification
    })
  } catch (error) {
    if (t) await t.rollback()

    console.error('Error sending notification:', error)
    res.status(500).json({
      message: 'Lỗi máy chủ nội bộ',
      error: error.message
    })
  }
}

module.exports = {
  getNotifications,
  addNotification,
  updateNotification,
  deleteNotification,
  sendNotificationToResidents
}
