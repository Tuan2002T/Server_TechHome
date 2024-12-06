const {
  sequelize,
  Vehicle,
  Resident,
  User,
  Complaint,
  Facility,
  Payment
} = require('../../Model/ModelDefinition')
const { paymentDate } = require('../../Model/PaymentModel')

const getPayments = async (req, res) => {
  try {
    const rs = await Payment.findAll()
    return res.status(200).json({
      status: true,
      data: rs
    })
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'An error occurred while retrieving facilities.'
    })
  }
}

const createPayment = async (req, res) => {
  try {
    const { paymentAmount, paymentStatus, orderCode } = req.body
    const newPayment = await Payment.create({
      paymentAmount,
      paymentStatus,
      // current date
      paymentDate: new Date(),
      orderCode
    })
    return res.status(200).json({
      status: true,
      data: newPayment
    })
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'An error occurred while creating payment.' + error.message
    })
  }
}

module.exports = {
  getPayments,
  createPayment
}
