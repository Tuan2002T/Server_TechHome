const {
  Service,
  User,
  ServiceBooking,
  Bill,
  OutsourcingService,
  Resident
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

const getServiceBookingsByServiceProviders = async (req, res) => {
  try {
    if (req.user.roleId !== 2) {
      return res
        .status(403)
        .json({ message: 'Access denied. Service Providers only.' })
    }

    const outsourcedServices = await OutsourcingService.findAll({
      where: { residentId: req.resident.residentId },
      attributes: ['outsourcingServiceId', 'residentId']
    })

    if (!outsourcedServices || outsourcedServices.length === 0) {
      return res.status(404).json({ message: 'Outsourced services not found' })
    }

    const outsourcingServiceIds = outsourcedServices.map(
      (service) => service.outsourcingServiceId
    )

    const serviceBookings = await ServiceBooking.findAll({
      where: {
        outsourcingServiceId: outsourcingServiceIds
      },
      attributes: ['serviceBookingId', 'outsourcingServiceId']
    })

    if (!serviceBookings || serviceBookings.length === 0) {
      return res.status(404).json({ message: 'Service bookings not found' })
    }

    const serviceBookingIds = serviceBookings.map(
      (booking) => booking.serviceBookingId
    )

    const bills = await Bill.findAll({
      where: {
        serviceBookingId: serviceBookingIds // Array chứa serviceBookingIds
      },
      include: [
        {
          model: ServiceBooking
        }
      ],
      include: [
        {
          model: Resident,
          attributes: ['residentId', 'phonenumber'],
          include: [
            {
              model: User
            }
          ]
        }
      ]
    })

    const formattedBills = bills.map((bill) => ({
      billName: bill.billName,
      billDate: bill.billDate,
      billAmount: bill.billAmount,
      billStatus: bill.billStatus,
      fullname: bill.Resident?.User?.fullname || null,
      email: bill.Resident?.User?.email || null,
      phonenumber: bill.Resident?.phonenumber || null
    }))

    res.status(200).json({
      data: formattedBills
    })
  } catch (error) {
    res.status(500).json({ error: 'Error fetching services and bills' })
    console.log('Error getting services and bills:', error)
  }
}

module.exports = {
  getAllServiceBookings,
  deleteServiceBooking,
  getServiceBookingsByServiceProviders
}
