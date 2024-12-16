const { Bill, ServiceBooking } = require('../../Model/ModelDefinition')

const getAllBills = async (req, res) => {
  try {
    if (req.user.roleId !== 2) {
      return res.status(403).json({ message: 'Access denied. Residents only.' })
    }

    const residentId = req.resident.residentId
    const bills = await Bill.findAll({
      where: { residentId }
    })
    return res.status(200).json(bills)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const createBill = async (req, res) => {
  try {
    if (req.user.roleId !== 2) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const { serviceBookingId } = req.body
    if (!serviceBookingId) {
      return res
        .status(400)
        .json({ message: 'Service booking ID and bill amount are required' })
    }

    const serviceBooking = await ServiceBooking.findOne({
      where: { serviceBookingId, residentId: req.resident.residentId }
    })

    if (!serviceBooking) {
      return res.status(404).json({ message: 'Service booking not found' })
    }

    const bill = await Bill.create({
      serviceBookingId,
      billAmount: serviceBooking.servicePrice,
      residentId: req.resident.residentId,
      billDate: new Date(),
      billName: serviceBooking.serviceName,
      billDate: new Date()
    })

    return res.status(201).json(bill)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

module.exports = { getAllBills, createBill }
