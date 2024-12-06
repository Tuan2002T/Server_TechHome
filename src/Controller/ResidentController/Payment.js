const { Op } = require('sequelize')
const { Payment, Bill, sequelize } = require('../../Model/ModelDefinition')
const payos = require('../../Payment/PayOs')

// const createPayment = async (req, res) => {
//   try {
//     if (req.user.roleId !== 2) {
//       return res.status(403).json({ message: 'Forbidden' })
//     }

//     const { billIds } = req.body

//     if (!billIds || billIds.length === 0) {
//       return res
//         .status(400)
//         .json({ message: 'Payment amount and bill IDs are required' })
//     }

//     let bills = []

//     for (const billId of billIds) {
//       const bill = await Payment.findOne({
//         where: { billId: billId }
//       })

//       console.log(bill)

//       if (bill) {
//         return res.status(404).json({ message: 'One or more bills not found' })
//       }
//     }
//     billIds.forEach((billId) => {
//       const bill = Bill.findOne({
//         where: { id: billId, residentId: req.resident.residentId }
//       })
//       bills.push(bill)
//     })

//     let payments = []
//     let amount = 0
//     let description = ''

//     for (const bill of bills) {
//       const payment = await Payment.create({
//         paymentAmount: bill.billAmount,
//         paymentStatus: 'Pending',
//         billId: bill.billId,
//         paymentDate: new Date()
//       })
//       amount += bill.billAmount
//       description += `Bill ID: ${bill.id}, `
//       payments.push(payment)
//     }

//     const requestPayment = {
//       orderCode: 4,
//       amount: 10000,
//       description: description.trim().slice(0, -1),
//       items: bills.map((bill) => ({
//         name: `Bill ${bill.id}`,
//         quantity: 1,
//         price: 10000
//       })),
//       cancelUrl: 'https://your-domain.com',
//       returnUrl: 'https://your-domain.com'
//     }

//     const response = await payos.createPaymentLink(requestPayment)

//     res.status(201).json({ payments, response })
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// }

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

    const totalAmount = bills.reduce((sum, bill) => sum + bill.billAmount, 0)

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

    console.log(totalAmount)
    console.log(paymentItems)

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
    console.log(response)

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

    const payment = await Payment.findOne({
      where: { orderCode: data.orderCode },
      transaction
    })

    if (!payment) {
      await transaction.rollback()
      return res.status(404).json({ message: 'Payment not found' })
    }

    if (desc === 'success') {
      payment.paymentStatus = 'success'
      await payment.save({ transaction })

      const billPayments = await Payment.findAll({
        where: { paymentId: payment.paymentId },
        include: {
          model: Bill,
          as: 'bills',
          through: {
            attributes: []
          }
        },
        transaction
      })

      await Promise.all(
        billPayments.map(async (bill) => {
          bill.billStatus = 'PAID'
          await bill.save({ transaction })
        })
      )

      await transaction.commit()
      console.log('Payment and bills updated successfully.')
      res.status(200).json({ message: 'Payment successful' })
    } else {
      payment.paymentStatus = 'Failed'
      await payment.save({ transaction })

      await transaction.commit()
      console.log('Payment status updated to Failed.')
      res.status(200).json(req.body)
    }
  } catch (error) {
    await transaction.rollback()
    console.error('Error processing webhook:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

module.exports = { createPayment, paymentWebhook, cancelledPayment }
