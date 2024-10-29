const { Bill } = require('../../Model/ModelDefinition')

const getAllBills = async (req, res) => {
  try {
    if (req.user.roleId !== 2) {
      return res.status(403).json({ message: 'Access denied. Residents only.' })
    }

    const residentId = req.user.userId
    const bills = await Bill.findAll({
      where: { residentId }
    })
    return res.status(200).json(bills)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
