const {
  Service,
  Resident,
  ServiceBooking,
  Bill
} = require('../../Model/ModelDefinition')

const getAllServiceBooking = async (req, res) => {
  try {
    if (req.user.roleId !== 2) {
      return res.status(403).json({ message: 'Access denied. Residents only.' })
    }

    const residentId = req.user.userId
    const booking = await ServiceBooking.findAll({
      where: { residentId }
    })
    return res.status(200).json(booking)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const bookingService = async (req, res) => {
  try {
    if (req.user.roleId !== 2) {
      return res.status(403).json({ message: 'Access denied. Residents only.' })
    }

    const serviceId = req.params.id

    const service = await Service.findAll({
      where: { serviceId }
    })
    const resident = await Resident.findOne({
      where: { residentId: req.user.userId }
    })

    if (!service || !resident) {
      return res.status(404).json({ message: 'Service or resident not found' })
    }

    const booking = {
      serviceId: serviceId,
      residentId: req.user.userId,
      bookingDate: new Date(),
      bookingStatus: 'Pending'
    }

    const newBooking = await ServiceBooking.create(booking)

    const bill = {
      serviceBookingId: newBooking.serviceBookingId,
      billAmount: service.servicePrice,
      residentId: req.resident.residentId,
      billDate: new Date(),
      billName: service[0].serviceName
    }

    const createBill = await Bill.create(bill)
    return res.status(201).json({ newBooking, bill: createBill })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const cancelBooking = async (req, res) => {
  try {
    if (req.user.roleId !== 2) {
      return res.status(403).json({ message: 'Access denied. Residents only.' })
    }
    const { bookingId } = req.params
    const booking = await ServiceBooking.findById(bookingId)

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }
    booking.bookingStatus = 'Cancelled'
    await booking.save()
    return res.status(204).send()
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

module.exports = {
  bookingService,
  cancelBooking,
  getAllServiceBooking
}
