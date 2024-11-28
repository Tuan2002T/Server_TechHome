const { Op } = require('sequelize')
const { Payment, Bill } = require('../../Model/ModelDefinition')
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
  try {
    if (req.user.roleId !== 2) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    const { billIds } = req.body

    if (!billIds || billIds.length === 0) {
      return res
        .status(400)
        .json({ message: 'Payment amount and bill IDs are required' })
    }

    for (const billId of billIds) {
      const bill = await Payment.findOne({
        where: { billId: billId }
      })

      if (bill) {
        return res.status(404).json({ message: 'One or more bills not found' })
      }
    }

    let payments = []
    let amount = 0
    let description = ''
    let bills = []
    for (const bill of billIds) {
      const b = await Bill.findOne({
        where: { billId: bill }
      })
      bills.push(bill)
      const payment = await Payment.create({
        paymentAmount: b.billAmount,
        paymentStatus: 'Pending',
        billId: billIds.billId,
        paymentDate: new Date()
      })
      amount += b.billAmount
      description += `Bill ID: ${b.id}, `
      payments.push(payment)
    }

    const requestPayment = {
      orderCode: 11,
      amount: 10000,
      description: description.trim().slice(0, -1),
      items: bills.map((bill) => ({
        name: `Bill ${bill.id}`,
        quantity: 1,
        price: 10000
      })),
      cancelUrl: 'https://your-domain.com',
      returnUrl: 'https://your-domain.com'
    }

    const response = await payos.createPaymentLink(requestPayment)

    res.status(201).json({ payments, response })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const cancelledPayment = async (req, res) => {
  try {
    const { orderCode } = req.body
    // const payment = await Payment.findOne({
    //   where: { orderCode }
    // })
    // if (!payment) {
    //   return res.status(404).json({ message: 'Payment not found' })
    // }
    // payment.paymentStatus = 'Cancelled'
    // await payment.save()
    await payos.cancelPaymentLink(orderCode)

    res.status(200).json({ message: 'Payment cancelled' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const paymentWebhook = async (req, res) => {
  console.log(req.body)
  res.status(200).json(req.body)
}

module.exports = { createPayment, paymentWebhook, cancelledPayment }
