const { Payment } = require('../../Model/ModelDefinition')

const getPayments = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const payments = await Payment.findAll()
    res.status(200).json({ data: payments })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const addPayment = async (req, res) => {
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

module.exports = { getPayments, addPayment }
