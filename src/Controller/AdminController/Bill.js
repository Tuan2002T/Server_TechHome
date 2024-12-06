const { Bill, User, Resident } = require('../../Model/ModelDefinition')

const getBills = async (req, res) => {
  try {
    const bills = await Bill.findAll({
      include: [
        {
          model: Resident,
          include: [
            {
              model: User,
              attributes: ['fullname']
            }
          ]
          // Assuming there's a foreign key 'residentId' in Bill model
        }
      ]
    })

    // Transform the response to flatten the resident name
    const transformedBills = bills.map((bill) => ({
      ...bill.get({ plain: true }),
      residentName: bill.Resident?.User?.fullname || 'Unknown',
      // Remove nested Resident object to keep response clean
      Resident: undefined
    }))

    return res.status(200).json({
      status: true,
      data: transformedBills
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getBills }
