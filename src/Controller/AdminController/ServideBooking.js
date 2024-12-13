const {
  Service,
  User,
  ServiceBooking,
  Bill
} = require('../../Model/ModelDefinition')

const getAllServiceBookings = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const servicebooking = await ServiceBooking.findAll()

    res.status(200).json({ status: true, data: servicebooking })
  } catch (error) {
    res.status(500).json({ error: 'Error fetching services' })
    console.log('Error getting services:', error)
  }
}

const deleteServiceBooking = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const serviceBookingId = req.params.id
    const servicebooking = await ServiceBooking.findOne({
      where: { serviceBookingId }
    })

    if (!servicebooking) {
      return res.status(404).json({ message: 'ServiceBooking not found' })
    }

    const bill = await Bill.findOne({
      where: { billId: servicebooking.serviceBookingId }
    })

    if (!bill) {
      return res
        .status(400)
        .json({ message: 'ServiceBooking cannot be deleted' })
    }

    bill.billStatus = 'CANCELLED'
    await bill.save()

    await ServiceBooking.destroy({ where: { serviceBookingId } })

    res.status(200).json({ message: 'ServiceBooking removed', data: bill })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  getAllServiceBookings,
  deleteServiceBooking
}
