const { Op } = require('sequelize')
const {
  Payment,
  Bill,
  sequelize,
  Resident
} = require('../../Model/ModelDefinition')
const payos = require('../../Payment/PayOs')
const { notificationPush } = require('../../FireBase/NotificationPush')
const { io, usersOnline, eventEmitter } = require('../../Socket/socket')

const createPayment = async (req, res) => {
  const transaction = await sequelize.transaction()

  try {
    if (req.user.roleId !== 2) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    const { billIds } = req.body

    if (!billIds || !Array.isArray(billIds) || billIds.length === 0) {
      return res.status(400).json({ message: 'Valid bill IDs are required' })
    }

    const bills = await Bill.findAll({
      where: {
        billId: {
          [Op.in]: billIds
        },
        billStatus: 'UNPAID'
      },
      transaction
    })

    if (bills.length !== billIds.length) {
      return res
        .status(404)
        .json({ message: 'One or more bills not found or already paid' })
    }

    const totalAmount = bills.reduce((sum, bill) => {
      const amount = parseFloat(bill.billAmount)
      return !isNaN(amount) ? sum + amount : sum
    }, 0)

    const payment = await Payment.create(
      {
        userId: req.user.userId,
        paymentStatus: 'Pending',
        paymentAmount: totalAmount,
        paymentDate: new Date(),
        orderCode: Math.floor(Math.random() * 1000000)
          .toString()
          .padStart(6, '0')
      },
      { transaction }
    )

    const billPaymentRecords = bills.map((bill) => ({
      billId: bill.id,
      paymentId: payment.id
    }))

    await payment.setBills(bills, { transaction })

    const paymentItems = bills.map((bill) => ({
      name: `Bill ${bill.id}`,
      quantity: 1,
      price: Number(bill.billAmount)
    }))

    const requestPayment = {
      orderCode: payment.orderCode,
      amount: Number(totalAmount),
      description: `Payment for bills: ${bills
        .map((bill) => bill.billId)
        .join(', ')}`,
      items: paymentItems,
      cancelUrl: process.env.CANCEL_URL || 'https://your-domain.com',
      returnUrl: process.env.RETURN_URL || 'https://your-domain.com'
    }

    const response = await payos.createPaymentLink(requestPayment)

    await transaction.commit()

    res.status(201).json({
      payment,
      paymentLink: response
    })
  } catch (error) {
    if (transaction) await transaction.rollback()

    console.error('Payment creation error:', error)
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

const cancelledPayment = async (req, res) => {
  try {
    const { orderCode } = req.body

    const payment = await Payment.findOne({
      where: { orderCode }
    })
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' })
    }
    payment.paymentStatus = 'Cancelled'
    await payment.save()
    await payos.cancelPaymentLink(orderCode)

    res.status(200).json({ message: 'Payment cancelled' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const paymentWebhook = async (req, res) => {
  const transaction = await sequelize.transaction()
  try {
    console.log('Webhook received:', req.body)
    const { data, desc } = req.body

    if (!data || !desc) {
      return res.status(400).json({ message: 'Invalid webhook payload' })
    }

    if (data.orderCode == 123) {
      return res.status(200).json({ message: 'Payment successful' })
    }

    const payment = await Payment.findOne({
      where: { orderCode: data.orderCode },
      transaction
    })

    if (!payment) {
      await transaction.rollback()
      return res.status(404).json({ message: 'Payment not found' })
    }

    if (desc === 'success') {
      payment.paymentStatus = 'Success'
      await payment.save({ transaction })

      const billPayments = await Bill.findAll({
        include: {
          model: Payment,
          where: { paymentId: payment.paymentId },
          through: {
            attributes: []
          }
        },
        transaction
      })

      // Cập nhật trạng thái của các Bill
      await Promise.all(
        billPayments.map(async (bill) => {
          bill.billStatus = 'PAID'
          await bill.save({ transaction })
        })
      )

      await transaction.commit()

      const resident = await Resident.findOne({
        where: { residentId: billPayments[0].residentId }
      })

      // if (resident && resident.tokenFCM !== null && resident.tokenFCM !== '') {
      //   notificationPush(
      //     resident.tokenFCM,
      //     'Payment successful',
      //     `Payment for bill ${billPayments[0].billId} successful`
      //   )
      // }
      const user = usersOnline.find((user) => user.userId === 3)
      if (user) {
        eventEmitter.emit('sendNotification', 3, 'Hello User 3')
      }
      console.log('Payment and bills updated successfully.')
      return res.status(200).json({ message: 'Payment successful' })
    } else {
      payment.paymentStatus = 'Failed'
      await payment.save({ transaction })
      await transaction.commit()

      console.log('Payment status updated to Failed.')
      return res.status(200).json({ message: 'Payment failed' })
    }
  } catch (error) {
    await transaction.rollback()
    console.error('Error processing webhook:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

const getBills = async (req, res) => {
  try {
    const residentId = req.resident.residentId

    const currentDate = new Date()
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    )

    const bills = await Bill.findAll({
      where: {
        residentId: residentId,
        billDate: {
          [Op.gte]: startOfMonth,
          [Op.lte]: currentDate
        }
      }
    })

    console.log(bills)

    const totalAmount = bills.reduce(
      (sum, bill) => sum + parseFloat(bill.billAmount),
      0
    )

    const serviceSummary = bills.reduce((acc, bill) => {
      if (acc[bill.billName]) {
        acc[bill.billName] += parseFloat(bill.billAmount)
      } else {
        acc[bill.billName] = parseFloat(bill.billAmount)
      }
      return acc
    }, {})

    console.log(totalAmount)

    const servicePercentage = Object.keys(serviceSummary).map((billName) => ({
      billName,
      percentage: ((serviceSummary[billName] / totalAmount) * 100).toFixed(2)
    }))

    res.status(200).json({ total: servicePercentage })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const testSocket = async (req, res) => {
  try {
    console.log('đây')
    console.log(usersOnline)

    const user = usersOnline.find((user) => user.userId === 3)
    console.log(user)
    console.log(eventEmitter)

    if (user) {
      eventEmitter.emit('sendNotification', 3, 'Hello User 3')
    }
    res.status(200).json({ message: 'Notification sent' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createPayment,
  paymentWebhook,
  cancelledPayment,
  getBills,
  testSocket
}
