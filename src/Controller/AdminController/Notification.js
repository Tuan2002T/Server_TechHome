const { Notification } = require('../../Model/ModelDefinition')

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

module.exports = {
  getNotifications,
  addNotification,
  updateNotification,
  deleteNotification
}
